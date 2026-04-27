(function() {
  'use strict';

  var _Object = Object;
  var _defineProperty = _Object.defineProperty;
  var _getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;
  var _Function = Function;
  var _origFunctionToString = _Function.prototype.toString;
  var _String = String;
  var _Map = Map;

  /** 让我们包装的函数对 fn.toString() 返回 "function NAME() { [native code] }"。 */
  var nativeSourceMap = new _Map();
  var fakeToString = function toString() {
    if (this != null) {
      var mapped = nativeSourceMap.get(this);
      if (typeof mapped === 'string') return mapped;
    }
    return _origFunctionToString.call(this);
  };
  nativeSourceMap.set(fakeToString, 'function toString() { [native code] }');
  try {
    _defineProperty(_Function.prototype, 'toString', {
      value: fakeToString,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  } catch (e) {}

  /** 包装替身函数：把它伪装成 "function NAME() { [native code] }"。 */
  var asNative = function(replacement, nativeName) {
    var src = 'function ' + nativeName + '() { [native code] }';
    nativeSourceMap.set(replacement, src);
    try {
      _defineProperty(replacement, 'name', {
        value: nativeName,
        writable: false,
        configurable: true,
        enumerable: false,
      });
    } catch (e) {}
    return replacement;
  };

  /** 替换 prototype 上的方法（保持原 descriptor 形态：默认 configurable+writable）。 */
  var replaceProtoMethod = function(proto, key, replacement) {
    try {
      var desc = _getOwnPropertyDescriptor(proto, key);
      if (!desc) return null;
      if (!desc.configurable) return null;
      _defineProperty(proto, key, {
        value: replacement,
        writable: 'writable' in desc ? !!desc.writable : true,
        configurable: true,
        enumerable: !!desc.enumerable,
      });
      return desc.value;
    } catch (e) {
      return null;
    }
  };

  /** 改写 prototype 上的 accessor：仅替换 getter/setter，保留 configurable/enumerable 形态。 */
  var replaceProtoAccessor = function(proto, key, options) {
    try {
      var desc = _getOwnPropertyDescriptor(proto, key);
      if (!desc || !desc.configurable) return null;
      var nextDesc = {
        configurable: true,
        enumerable: !!desc.enumerable,
      };
      if (options.get || desc.get) nextDesc.get = options.get || desc.get;
      if (options.set || desc.set) nextDesc.set = options.set || desc.set;
      _defineProperty(proto, key, nextDesc);
      return desc;
    } catch (e) {
      return null;
    }
  };

  // ===== navigator.webdriver：在 Navigator.prototype 上覆盖 getter，保持 accessor 形态 =====
  try {
    var navProto = Object.getPrototypeOf(navigator);
    if (navProto) {
      replaceProtoAccessor(navProto, 'webdriver', {
        get: asNative(function() { return false; }, 'get webdriver'),
      });
    }
  } catch (e) {}

  // ===== navigator.languages：仅在为空时回填，使用 prototype getter =====
  try {
    if (!navigator.languages || navigator.languages.length === 0) {
      var navProto2 = Object.getPrototypeOf(navigator);
      if (navProto2) {
        var langs = ['zh-CN', 'zh', 'en'];
        replaceProtoAccessor(navProto2, 'languages', {
          get: asNative(function() { return langs; }, 'get languages'),
        });
      }
    }
  } catch (e) {}

  // ===== window.close：改为空函数（保留 native 形态）=====
  try {
    var winProto = Object.getPrototypeOf(window);
    if (winProto) {
      replaceProtoMethod(winProto, 'close', asNative(function close() {}, 'close'));
    }
  } catch (e) {}

  // ===== history.back / forward / go =====
  try {
    var historyProto = Object.getPrototypeOf(history);
    if (historyProto) {
      var origGo = historyProto.go;
      replaceProtoMethod(historyProto, 'back', asNative(function back() {}, 'back'));
      replaceProtoMethod(historyProto, 'forward', asNative(function forward() {}, 'forward'));
      replaceProtoMethod(historyProto, 'go', asNative(function go(n) {
        if (typeof n === 'number' && n < 0) return undefined;
        return origGo.call(this, n);
      }, 'go'));
    }
  } catch (e) {}

  // ===== Location.assign / replace / href setter =====
  var BLOCK_PATH = /\\/web\\/common\\/(?:403|nonsupport)\\.html|\\/web\\/user\\/safe\\/verify|\\/web\\/passport\\/(?:zp\\/(?:403|verify|security)\\.html|cm\\/(?:403|verify|security-check)\\.html)/i;
  var isBlockedTarget = function(value) {
    var s = _String(value);
    if (s === 'about:blank') return true;
    return BLOCK_PATH.test(s);
  };
  try {
    var locProto = Location.prototype;
    var origAssign = locProto.assign;
    var origReplace = locProto.replace;
    replaceProtoMethod(locProto, 'assign', asNative(function assign(url) {
      if (isBlockedTarget(url)) return undefined;
      return origAssign.call(this, url);
    }, 'assign'));
    replaceProtoMethod(locProto, 'replace', asNative(function replace(url) {
      if (isBlockedTarget(url)) return undefined;
      return origReplace.call(this, url);
    }, 'replace'));

    var hrefDesc = _getOwnPropertyDescriptor(locProto, 'href');
    if (hrefDesc && hrefDesc.configurable && hrefDesc.set) {
      var origHrefSet = hrefDesc.set;
      _defineProperty(locProto, 'href', {
        get: hrefDesc.get,
        set: asNative(function(value) {
          if (isBlockedTarget(value)) return undefined;
          return origHrefSet.call(this, value);
        }, 'set href'),
        configurable: true,
        enumerable: !!hrefDesc.enumerable,
      });
    }
  } catch (e) {}

  // ===== beforeunload / unload：阻止破坏性卸载 =====
  try {
    var stopUnload = function(e) {
      if (!e) return;
      try { e.preventDefault(); } catch (_) {}
      try { e.returnValue = ''; } catch (_) {}
    };
    window.addEventListener('beforeunload', stopUnload);
    window.addEventListener('unload', stopUnload, true);
  } catch (e) {}

  // ===== console.clear：可选替身，原生形态空函数 =====
  if (!false) {
    try {
      var consoleProtoForClear = Object.getPrototypeOf(console);
      var ownClearDesc = Object.getOwnPropertyDescriptor(console, 'clear');
      var protoClearDesc = consoleProtoForClear
        ? _getOwnPropertyDescriptor(consoleProtoForClear, 'clear')
        : null;
      var clearSrcDesc = ownClearDesc || protoClearDesc;
      if (clearSrcDesc && typeof clearSrcDesc.value === 'function') {
        try {
          _defineProperty(console, 'clear', {
            value: asNative(function clear() {}, 'clear'),
            writable: 'writable' in clearSrcDesc ? clearSrcDesc.writable !== false : true,
            configurable: true,
            enumerable: !!clearSrcDesc.enumerable,
          });
        } catch (_) {}
      }
    } catch (e) {}
  }

  // ===== console 时间差探测对抗 =====
  // 主包用 `console.log` / `console.table` 重复打印大对象（典型：50 次 × 0..500 数组），
  // 比较前后 `performance.now()`，DevTools 打开时 V8 inspector 会把对象逐一序列化送去，
  // 耗时显著上升即判定 DevTools 打开。对抗手段：把所有对象参数在我们这层先归一化为
  // `[object Type]` 这种 O(1) 字符串再交给原生方法，inspector 序列化路径只看到短字符串，
  // 耗时不再随 DevTools 状态变化。代价：DevTools 控制台中对象会显示成 `[object Type]`，
  // 失去对象树展开 UX；断点 / Watch / Sources / 调用栈不受影响。
  if (!false) {
    try {
      var _objToString = Object.prototype.toString;
      var sanitizeArgs = function(rawArgs) {
        var len = rawArgs.length;
        var out = new Array(len);
        for (var i = 0; i < len; i++) {
          var a = rawArgs[i];
          if (a !== null && typeof a === 'object') {
            try {
              out[i] = _objToString.call(a);
            } catch (_) {
              out[i] = '[object Object]';
            }
          } else if (typeof a === 'function') {
            // 函数也别交给 inspector，避免 toString 串走慢路径
            out[i] = '[Function: ' + (a.name || 'anonymous') + ']';
          } else {
            out[i] = a;
          }
        }
        return out;
      };
      var consoleProtoForLog = Object.getPrototypeOf(console);
      var consoleMethodNames = [
        'log', 'info', 'debug', 'warn', 'error',
        'table', 'dir', 'dirxml', 'trace',
        'group', 'groupCollapsed',
      ];
      for (var ci = 0; ci < consoleMethodNames.length; ci++) {
        (function(method) {
          // Chrome 把这些方法挂在 console 实例的 own property 上；
          // 部分浏览器（含历史 Firefox）会挂在 Console.prototype 上。
          // 优先取 own，否则退回 prototype；patch 一律 define 到实例上，
          // 这样既能覆盖 own 写法，又能在 prototype 形态下 shadow 掉原方法。
          var ownDesc = Object.getOwnPropertyDescriptor(console, method);
          var protoDesc = consoleProtoForLog
            ? _getOwnPropertyDescriptor(consoleProtoForLog, method)
            : null;
          var srcDesc = ownDesc || protoDesc;
          if (!srcDesc || typeof srcDesc.value !== 'function') return;
          var orig = srcDesc.value;
          var wrapped = asNative(function() {
            return orig.apply(this, sanitizeArgs(arguments));
          }, method);
          try {
            _defineProperty(console, method, {
              value: wrapped,
              writable: 'writable' in srcDesc ? srcDesc.writable !== false : true,
              configurable: true,
              enumerable: !!srcDesc.enumerable,
            });
          } catch (_) {}
        })(consoleMethodNames[ci]);
      }
    } catch (e) {}
  }
})();