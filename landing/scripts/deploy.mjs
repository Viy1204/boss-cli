#!/usr/bin/env node
/**
 * boss-cli landing 部署脚本
 *
 * 流程：docker build → login → push → SSH 远程 pull + run
 *
 * 必填（在 .env.deploy 中配置）：
 *   DOCKER_REGISTRY   镜像仓库地址，如 registry.cn-shanghai.aliyuncs.com/your-ns
 *   DOCKER_USERNAME   仓库登录用户名
 *   DOCKER_PASSWORD   仓库登录密码
 *   SSH_HOST          服务器 IP 或域名
 *   SSH_USERNAME      SSH 用户名
 *   SSH_PASSWORD      SSH 密码
 *
 * 可选：
 *   DEPLOY_TAG              镜像 tag，默认 latest（CI 可用 GITHUB_SHA 前 7 位）
 *   DOCKER_IMAGE_NAME       镜像名，默认取 package.json name
 *   SSH_PORT                SSH 端口，默认 22
 *   DEPLOY_CONTAINER_NAME   容器名，默认 boss-cli-landing
 *   DEPLOY_PUBLISH_PORT     宿主机映射端口，默认 38522
 *   DEPLOY_CONTAINER_TZ     容器时区，如 Asia/Shanghai
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { Client } from 'ssh2'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// 先加载 .env 作为基础，再用 .env.deploy 覆盖部署变量
loadDotenv({ path: join(root, '.env'), override: false })
loadDotenv({ path: join(root, '.env.deploy'), override: true })

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function requireEnv(name) {
  const v = process.env[name]?.trim()
  if (!v) {
    console.error(`[deploy] 缺少必填环境变量: ${name}`)
    process.exit(1)
  }
  return v
}

/** Bash 单引号安全转义 */
function q(s) {
  return `'${String(s).replace(/'/g, `'"'"'`)}'`
}

function readPackageName() {
  try {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    return pkg.name || 'boss-cli-landing'
  } catch {
    return 'boss-cli-landing'
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} 退出码 ${code}`))
    })
  })
}

function dockerLogin(host, user, password) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', ['login', host, '-u', user, '--password-stdin'], {
      cwd: root,
      stdio: ['pipe', 'inherit', 'inherit'],
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`docker login 退出码 ${code}`))
    })
    child.stdin.write(password)
    child.stdin.end()
  })
}

function execRemoteBash(host, port, username, password, script) {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      conn.exec('bash -s', (err, stream) => {
        if (err) { conn.end(); reject(err); return }
        stream.stdout.pipe(process.stdout)
        stream.stderr.pipe(process.stderr)
        stream.on('close', (code) => {
          conn.end()
          if (code === 0) resolve()
          else reject(new Error(`远程脚本退出码 ${code}`))
        })
        stream.end(script)
      })
    })
    conn.on('error', reject)
    conn.connect({ host, port, username, password, readyTimeout: 30_000 })
  })
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  const registry    = requireEnv('DOCKER_REGISTRY').replace(/\/+$/, '')
  const dockerUser  = requireEnv('DOCKER_USERNAME')
  const dockerPass  = requireEnv('DOCKER_PASSWORD')
  const sshHost     = requireEnv('SSH_HOST')
  const sshUser     = requireEnv('SSH_USERNAME')
  const sshPass     = requireEnv('SSH_PASSWORD')

  const loginHost   = registry.split('/')[0]
  const imageName   = (process.env.DOCKER_IMAGE_NAME || readPackageName()).trim()
  const tag         = (process.env.DEPLOY_TAG || '').trim()
                      || (process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : '')
                      || 'latest'
  const fullImage   = `${registry}/${imageName}:${tag}`

  const container   = (process.env.DEPLOY_CONTAINER_NAME || 'boss-cli-landing').trim()
  const port        = (process.env.DEPLOY_PUBLISH_PORT   || '38522').trim()
  const tz          = (process.env.DEPLOY_CONTAINER_TZ   || '').trim()
  const sshPort     = Number(process.env.SSH_PORT || '22') || 22

  // Base64 密码，避免在远程脚本中出现特殊字符
  const passB64 = Buffer.from(dockerPass, 'utf8').toString('base64')

  const tzFlag = tz ? `-e TZ=${q(tz)}` : ''

  const remoteScript = [
    'set -e',
    `PASS=$(printf '%s' '${passB64}' | base64 -d)`,
    `printf '%s' "$PASS" | docker login ${q(loginHost)} -u ${q(dockerUser)} --password-stdin`,
    `docker pull ${q(fullImage)}`,
    `docker stop ${q(container)} 2>/dev/null || true`,
    `docker rm   ${q(container)} 2>/dev/null || true`,
    [
      'docker run -d',
      `--name ${q(container)}`,
      '--restart unless-stopped',
      `-p ${q(`${port}:3000`)}`,
      tzFlag,
      q(fullImage),
    ].filter(Boolean).join(' '),
    `echo "[deploy] 容器已启动: ${container}"`,
    '',
  ].join('\n')

  console.log(`\n[deploy] 构建镜像: ${fullImage}`)
  await run('docker', ['build', '-t', fullImage, '.'])

  console.log(`[deploy] 登录仓库: ${loginHost}`)
  await dockerLogin(loginHost, dockerUser, dockerPass)

  console.log(`[deploy] 推送镜像: ${fullImage}`)
  await run('docker', ['push', fullImage])

  console.log(`[deploy] SSH -> ${sshUser}@${sshHost}:${sshPort}`)
  await execRemoteBash(sshHost, sshPort, sshUser, sshPass, remoteScript)

  console.log('[deploy] 完成\n')
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
