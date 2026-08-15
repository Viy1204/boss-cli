import { randomIntInclusive, selectAllModifierKey, SEND_AFTER_ENTER_MS, SEND_INPUT_CLICK_MS, SEND_TYPING_GAP_MS, sleepRandom, typeTextWithRandomKeyDelay, } from '../browser/index.js';
import { isBossChatIndexUrl } from '../common/auth.js';
import { withBossSessionPage } from '../common/boss_session_page.js';
import { runRequestAttachmentResume } from './action.js';
export async function runSendChatMessage(options) {
    const messageText = (options.text ?? '').trim();
    const signal = options.signal;
    const requestResume = options.requestResume ?? false;
    if (!messageText) {
        throw new Error('请指定 --text <消息> 或 -t <消息>。');
    }
    try {
        return await withBossSessionPage(async (page) => {
            const currentUrl = page.url();
            if (!isBossChatIndexUrl(currentUrl)) {
                throw new Error('请先进入聊天列表页（/web/chat/index）并打开候选人聊天。');
            }
            const input = await page.$('#boss-chat-editor-input');
            if (!input) {
                throw new Error('未找到聊天输入框（#boss-chat-editor-input）。');
            }
            await input.click({
                delay: randomIntInclusive(SEND_INPUT_CLICK_MS.min, SEND_INPUT_CLICK_MS.max),
            });
            await sleepRandom(60, 220, signal);
            const selectAllMod = selectAllModifierKey();
            await page.keyboard.down(selectAllMod);
            await page.keyboard.press('KeyA');
            await page.keyboard.up(selectAllMod);
            await sleepRandom(45, 180, signal);
            await page.keyboard.press('Backspace');
            await sleepRandom(80, 260, signal);
            await typeTextWithRandomKeyDelay(page, messageText, SEND_TYPING_GAP_MS.min, SEND_TYPING_GAP_MS.max, signal);
            await sleepRandom(120, 420, signal);
            await page.keyboard.press('Enter');
            await sleepRandom(SEND_AFTER_ENTER_MS.min, SEND_AFTER_ENTER_MS.max, signal);
            if (!requestResume) {
                return `已发送消息：${messageText}`;
            }
            await sleepRandom(1200, 2800, signal);
            const resumeResult = await runRequestAttachmentResume(page);
            return `已发送消息：${messageText}\n${resumeResult}`;
        });
    }
    catch (e) {
        if (e instanceof Error) {
            throw e;
        }
        throw new Error(`发送消息失败：${String(e)}`);
    }
}
//# sourceMappingURL=send.js.map