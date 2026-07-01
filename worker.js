var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// worker.js
var ROBOTS_TXT = `User-agent: *
Allow: /
Sitemap: https://filmgeneva.ch/sitemap.xml
Crawl-delay: 1
Disallow: /api/
`;
var LLMS_TXT = `# FilmGeneva

> Professional video production, photography, livestreaming, and podcast recording company based in Geneva, Switzerland, serving NGOs, corporations, international organisations, and individual clients across Switzerland and internationally.

FilmGeneva produces corporate video, event filming, conference coverage, livestreaming, photography, podcast and audio recording, and drone/aerial work. Clients include the BBC, ITV, WHO, WTO, CERN, ICRC, AI for Good, TikTok, Campus Biotech, the Swiss Economic Forum, and the University of Geneva, among others. Cameras include Panasonic Lumix, Sony FX series, and Canon EOS, shooting up to 8K.

## Main sections

- [Home](https://filmgeneva.ch/) \u2014 Overview of services, clients, and company information
- [Video Production](https://filmgeneva.ch/video-production) \u2014 Corporate video, documentaries, event filming, NGO content
- [Livestreaming](https://filmgeneva.ch/livestreaming-geneva) \u2014 Conference, hybrid event, and concert livestreaming
- [Photography](https://filmgeneva.ch/photography-geneva) \u2014 Event, corporate, portrait, real estate, and product photography
- [Podcasts & Audio](https://filmgeneva.ch/podcast-recording-geneva) \u2014 Podcast recording, concert recording, lecture recording
- [Production Company](https://filmgeneva.ch/production-company-geneva) \u2014 End-to-end production support: location scouting, permits, crew, equipment
- [About](https://filmgeneva.ch/about-filmgeneva) \u2014 Company background, equipment, and client testimonials
- [Contact](https://filmgeneva.ch/contact-filmgeneva) \u2014 Phone, email, WhatsApp, Signal, Telegram, and quote request form

## Notable specialised pages

- [NGO Video Production](https://filmgeneva.ch/ngo-video-production-geneva)
- [Conference Filming](https://filmgeneva.ch/conference-filming-geneva)
- [Wedding Videography](https://filmgeneva.ch/wedding-videographer-geneva)
- [Drone & Aerial Filming](https://filmgeneva.ch/drone-filming-geneva-switzerland)
- [Watch & Jewellery Photography](https://filmgeneva.ch/watch-photography-geneva)
- [Political & Diplomatic Video](https://filmgeneva.ch/political-diplomatic-video-geneva)
- [WHO Interview Production](https://filmgeneva.ch/who-interview-production-geneva)

## Contact

Phone / WhatsApp / Signal / Telegram: +41 76 747 77 14
Email: filmgeneva1@gmail.com
Address: Rue de Vermont 42, Geneva, Switzerland
`;
var SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://filmgeneva.ch/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://filmgeneva.ch/video-production</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/livestreaming-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/photography-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/podcast-recording-geneva</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/about-filmgeneva</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/contact-filmgeneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/production-company-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/corporate-video-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/conference-filming-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/ngo-video-production-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/conference-livestream-geneva</loc><priority>0.85</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/event-photography-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/executive-headshots-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/real-estate-photography-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/watch-photography-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/wedding-videographer-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/drone-filming-geneva-switzerland</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/video-podcast-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/short-film-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/political-diplomatic-video-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/who-interview-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/classical-music-livestream-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/interview-video-production-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/davos-wef-event-coverage-geneva</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/art-performance-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/beauty-lifestyle-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/sports-video-production-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/science-communication-video-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://filmgeneva.ch/social-media-video-production-geneva</loc><priority>0.75</priority><changefreq>monthly</changefreq></url>
</urlset>`;
var ROUTE_MAP = { "/": { "key": "home", "title": "FilmGeneva \u2014 Professional Video & Photography in Geneva, Switzerland", "desc": "Professional video production, photography, livestreaming and podcast recording in Geneva, Switzerland." }, "/video-production": { "key": "video", "title": "Video Production Geneva | FilmGeneva", "desc": "Expert video production in Geneva \u2014 corporate films, documentaries, event filming, NGO content and more. Up to 8K." }, "/livestreaming-geneva": { "key": "livestream", "title": "Livestreaming Geneva | FilmGeneva", "desc": "Professional livestreaming services in Geneva. Conferences, hybrid events, concerts, AGMs." }, "/photography-geneva": { "key": "photography", "title": "Photography Geneva | FilmGeneva", "desc": "Professional event, corporate, portrait, real estate and aerial photography in Geneva and Switzerland." }, "/podcast-recording-geneva": { "key": "podcasts", "title": "Podcast & Audio Recording Geneva | FilmGeneva", "desc": "Studio-quality podcast and audio recording in Geneva. On-location, no studio needed." }, "/about-filmgeneva": { "key": "about", "title": "About FilmGeneva | Video Production Company Geneva", "desc": "FilmGeneva \u2014 professional video production company in Geneva. 4+ years experience, 100+ projects." }, "/contact-filmgeneva": { "key": "contact", "title": "Contact FilmGeneva | Get a Quote", "desc": "Contact FilmGeneva for a free quote. Video production, photography, livestreaming in Geneva." }, "/corporate-video-production-geneva": { "key": "corporate-videos", "title": "Corporate Video Production Geneva | FilmGeneva", "desc": "Professional corporate video production in Geneva." }, "/ceo-interview-video-geneva": { "key": "ceo-interviews", "title": "CEO & Executive Interview Video Geneva | FilmGeneva", "desc": "Executive and CEO interview production in Geneva." }, "/conference-filming-geneva": { "key": "conference-filming", "title": "Conference Filming Geneva | FilmGeneva", "desc": "Professional conference and summit filming in Geneva. Palexpo, WMO, CICG." }, "/conference-highlight-reel-geneva": { "key": "conference-highlights", "title": "Conference Highlight Reel Geneva | FilmGeneva", "desc": "Conference highlight reels in Geneva." }, "/ngo-video-production-geneva": { "key": "ngo-filming", "title": "NGO Video Production Geneva | FilmGeneva", "desc": "Video production for NGOs and international organisations in Geneva." }, "/science-communication-video-geneva": { "key": "science-videos", "title": "Science Communication Video Geneva | FilmGeneva", "desc": "Science communication videos for research institutions in Geneva." }, "/documentary-film-production-geneva": { "key": "documentary-filming", "title": "Documentary Film Production Geneva | FilmGeneva", "desc": "Documentary film production in Geneva." }, "/drone-filming-geneva-switzerland": { "key": "drone-footage", "title": "Drone & Aerial Filming Geneva | FilmGeneva", "desc": "Licensed drone operator for aerial filming across Geneva and Switzerland." }, "/wedding-videographer-geneva": { "key": "wedding-filming", "title": "Wedding Videographer Geneva | FilmGeneva", "desc": "Cinematic wedding films in Geneva and Switzerland." }, "/real-estate-video-production-geneva": { "key": "real-estate-video", "title": "Real Estate Video Production Geneva | FilmGeneva", "desc": "Cinematic property walkthroughs and drone aerial footage in Geneva." }, "/social-media-video-production-geneva": { "key": "social-media-video", "title": "Social Media Video Production Geneva | FilmGeneva", "desc": "Reels, Shorts and branded content for social media. Made in Geneva." }, "/conference-livestream-geneva": { "key": "conference-livestream", "title": "Conference Livestreaming Geneva | FilmGeneva", "desc": "Broadcast-quality conference livestreaming in Geneva." }, "/hybrid-event-production-geneva": { "key": "hybrid-events", "title": "Hybrid Event Production Geneva | FilmGeneva", "desc": "Professional hybrid event production in Geneva." }, "/concert-livestreaming-geneva": { "key": "concert-streaming", "title": "Concert Livestreaming Geneva | FilmGeneva", "desc": "Professional concert livestreaming in Geneva." }, "/agm-livestreaming-geneva": { "key": "agm-livestream", "title": "AGM & General Assembly Livestreaming Geneva | FilmGeneva", "desc": "Reliable AGM and general assembly livestreaming in Geneva." }, "/event-photography-geneva": { "key": "event-photography", "title": "Event Photography Geneva | FilmGeneva", "desc": "Professional event photography in Geneva." }, "/executive-headshots-geneva": { "key": "headshots-portraits", "title": "Executive Headshots & Corporate Portraits Geneva | FilmGeneva", "desc": "Natural, professional executive headshots in Geneva." }, "/conference-photography-geneva": { "key": "conference-photography", "title": "Conference Photography Geneva | FilmGeneva", "desc": "Conference photography in Geneva at Palexpo, WMO, CICG." }, "/real-estate-photography-geneva": { "key": "real-estate-photography", "title": "Real Estate Photography Geneva | FilmGeneva", "desc": "Professional real estate photography in Geneva." }, "/airbnb-photography-geneva": { "key": "airbnb-photography", "title": "Airbnb & Rental Photography Geneva | FilmGeneva", "desc": "Professional Airbnb and vacation rental photography in Geneva." }, "/watch-photography-geneva": { "key": "watches-photography", "title": "Watch & Jewellery Photography Geneva | FilmGeneva", "desc": "Precision product photography for Swiss watches and jewellery." }, "/video-podcast-production-geneva": { "key": "video-podcast", "title": "Video Podcast Production Geneva | FilmGeneva", "desc": "Multi-camera video podcast recording in Geneva." }, "/podcast-recording-service-geneva": { "key": "audio-podcast", "title": "Audio Podcast Recording Geneva | FilmGeneva", "desc": "Broadcast-quality audio podcast recording in Geneva." }, "/concert-recording-geneva": { "key": "concert-recording", "title": "Concert & Music Recording Geneva | FilmGeneva", "desc": "Professional multi-camera concert recording in Geneva." }, "/lecture-recording-geneva": { "key": "lecture-recording", "title": "Lecture & Academic Recording Geneva | FilmGeneva", "desc": "Professional lecture and academic recording in Geneva." }, "/sports-video-production-geneva": { "key": "sports-filming", "title": "Sports & Action Video Production Geneva | FilmGeneva", "desc": "Dynamic sports filming for athletes, events and brands in Geneva." }, "/behind-the-scenes-video-geneva": { "key": "behind-scenes", "title": "Behind the Scenes Video Production Geneva | FilmGeneva", "desc": "BTS content for productions and brand activations in Geneva." }, "/influencer-video-production-geneva": { "key": "content-creator-video", "title": "Influencer & Content Creator Video Geneva | FilmGeneva", "desc": "Professional video production for content creators in Geneva." }, "/greenscreen-production-geneva": { "key": "greenscreen", "title": "Greenscreen & Studio Production Geneva | FilmGeneva", "desc": "Professional greenscreen production for virtual studios in Geneva." }, "/timelapse-video-geneva": { "key": "timelapse", "title": "Time-lapse Video Production Geneva | FilmGeneva", "desc": "Professional time-lapse filming in Geneva." }, "/agm-corporate-event-video-geneva": { "key": "agm-corporate-events", "title": "AGM & Corporate Event Video Geneva | FilmGeneva", "desc": "Professional video and livestreaming for AGMs in Geneva." }, "/short-film-production-geneva": { "key": "short-films", "title": "Short Film Production Geneva | FilmGeneva", "desc": "Award-winning short film production in Geneva. REBOOT won Best Film & Audience Award at 48HFP." }, "/political-diplomatic-video-geneva": { "key": "political-diplomatic", "title": "Political & Diplomatic Video Production Geneva | FilmGeneva", "desc": "Video production for diplomatic missions and political events in Geneva." }, "/who-interview-production-geneva": { "key": "who-interviews", "title": "WHO Interview Production Geneva | FilmGeneva", "desc": "Professional interview production for the World Health Organization." }, "/classical-music-livestream-geneva": { "key": "classical-music-livestream", "title": "Classical Music Livestream Geneva | FilmGeneva", "desc": "Professional classical music filming and livestreaming in Geneva." }, "/interview-video-production-geneva": { "key": "interviews", "title": "Interview Video Production Geneva | FilmGeneva", "desc": "Professional on-camera interview production in Geneva." }, "/davos-wef-event-coverage-geneva": { "key": "davos-events", "title": "Davos & International Summit Coverage | FilmGeneva", "desc": "Event coverage for Davos, WEF and major international summits." }, "/art-performance-video-geneva": { "key": "art-performance", "title": "Art & Performance Video Production Geneva | FilmGeneva", "desc": "Cinematic filming for performing arts and creative productions in Geneva." }, "/beauty-lifestyle-video-geneva": { "key": "beauty-lifestyle", "title": "Beauty & Lifestyle Video Production Geneva | FilmGeneva", "desc": "Professional video for beauty brands and influencers in Geneva." }, "/production-company-geneva": { "key": "production-company", "title": "Production Company Geneva | FilmGeneva", "desc": "End-to-end video production company in Geneva and Switzerland. Location scouting, permits, crew, equipment, set coordination and logistics." }, "/geneva-locations-photography": { "key": "locations", "title": "Geneva & Switzerland Locations | FilmGeneva", "desc": "Aerial and location photography across Geneva, Lake Geneva and Switzerland." }, "/testimonial-video-production-geneva": { "key": "testimonial-videos", "title": "Testimonial Video Production Geneva | FilmGeneva", "desc": "Authentic client testimonial videos for marketing, websites, and social media in Geneva." }, "/explainer-video-production-geneva": { "key": "explainer-videos", "title": "Explainer Video Production Geneva | FilmGeneva", "desc": "Clear, engaging explainer videos for products, services, and concepts in Geneva." }, "/product-launch-video-geneva": { "key": "product-launch-videos", "title": "Product Launch Video Production Geneva | FilmGeneva", "desc": "Cinematic product launch films for Swiss and international brands." }, "/training-video-production-geneva": { "key": "training-videos", "title": "Training & Onboarding Video Geneva | FilmGeneva", "desc": "Clear, professional training and onboarding videos for businesses in Geneva." }, "/music-video-production-geneva": { "key": "music-videos-filming", "title": "Music Video Production Geneva | FilmGeneva", "desc": "Creative music video production for artists in Geneva and Switzerland." }, "/film-tv-production-support-geneva": { "key": "interviews-film-tv", "title": "Film & TV Production Support Geneva | FilmGeneva", "desc": "Local crew, equipment, and fixer services for international broadcasters filming in Geneva." }, "/webinar-production-geneva": { "key": "webinars", "title": "Webinar Production Geneva | FilmGeneva", "desc": "Professional webinar production in Geneva \u2014 camera, audio, and streaming." }, "/award-ceremony-livestream-geneva": { "key": "award-ceremony-livestream", "title": "Award Ceremony Livestreaming Geneva | FilmGeneva", "desc": "Multi-camera livestreaming of award ceremonies and gala dinners in Geneva." }, "/memorial-livestream-geneva": { "key": "memorial-livestream", "title": "Memorial & Ceremony Livestreaming Geneva | FilmGeneva", "desc": "Discreet, respectful livestreaming of memorial services in Geneva." }, "/multi-platform-livestreaming-geneva": { "key": "multi-platform-streaming", "title": "Multi-Platform Livestreaming Geneva | FilmGeneva", "desc": "Stream simultaneously to YouTube, LinkedIn, Zoom, Teams and any RTMP platform." }, "/ngo-photography-geneva": { "key": "ngo-photography", "title": "NGO & Field Photography Geneva | FilmGeneva", "desc": "Impactful photography for international organisations and humanitarian projects in Geneva." }, "/food-restaurant-photography-geneva": { "key": "food-photography", "title": "Food & Restaurant Photography Geneva | FilmGeneva", "desc": "Appetising food and restaurant photography in Geneva." }, "/watch-jewellery-photography-geneva": { "key": "watch-jewellery-photography", "title": "Watch & Jewellery Photography Geneva | FilmGeneva", "desc": "Precision product photography for Swiss watches and jewellery." }, "/drone-aerial-photography-geneva": { "key": "drone-photography", "title": "Drone & Aerial Photography Geneva | FilmGeneva", "desc": "Licensed drone aerial photography across Geneva and Switzerland." }, "/architecture-photography-geneva": { "key": "architecture-photography", "title": "Architecture Photography Geneva | FilmGeneva", "desc": "Precise, beautiful architectural photography for buildings and properties in Geneva." }, "/concert-performance-photography-geneva": { "key": "concert-photography", "title": "Concert & Performance Photography Geneva | FilmGeneva", "desc": "Dynamic live music and performance photography in Geneva." }, "/fashion-photography-geneva": { "key": "fashion-photography", "title": "Fashion Photography Geneva | FilmGeneva", "desc": "Editorial and commercial fashion photography for designers and brands in Geneva." }, "/interview-podcast-production-geneva": { "key": "interview-podcast", "title": "Interview Podcast Production Geneva | FilmGeneva", "desc": "Professional one-on-one interview podcast production in Geneva." }, "/panel-discussion-podcast-geneva": { "key": "panel-podcast", "title": "Panel Discussion Podcast Geneva | FilmGeneva", "desc": "Multi-guest panel podcast production in Geneva." }, "/conference-podcast-production-geneva": { "key": "conference-podcast", "title": "Conference Podcast Production Geneva | FilmGeneva", "desc": "On-site podcast recording at your conference in Geneva." }, "/corporate-podcast-production-geneva": { "key": "corporate-podcast", "title": "Corporate Podcast Production Geneva | FilmGeneva", "desc": "Regular corporate podcast production for businesses in Geneva." }, "/ngo-humanitarian-podcast-geneva": { "key": "ngo-podcast", "title": "NGO & Humanitarian Podcast Geneva | FilmGeneva", "desc": "Podcast production for NGOs and international organisations in Geneva." }, "/music-session-recording-geneva": { "key": "music-session", "title": "Music Session Recording Geneva | FilmGeneva", "desc": "Studio-style music session recording in any space in Geneva." }, "/audiogram-podcast-clips-geneva": { "key": "audiograms", "title": "Audiogram & Podcast Clip Production Geneva | FilmGeneva", "desc": "Animated audiogram and social media clip production for podcasts." }, "/event-audio-support-geneva": { "key": "event-audio-support", "title": "Event Audio Support Geneva | FilmGeneva", "desc": "Professional technical audio support for events and conferences in Geneva." } };
function getContentType(key) {
  const ext = key.split(".").pop().toLowerCase();
  const types = {
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    avif: "image/avif",
    html: "text/html; charset=utf-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    txt: "text/plain"
  };
  return types[ext] || "application/octet-stream";
}
__name(getContentType, "getContentType");
function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'nonce-${nonce}' https://static.cloudflareinsights.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https: data:",
      "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://w.soundcloud.com",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
      "require-trusted-types-for 'script'",
      "trusted-types default"
    ].join("; ")
  );
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  const out = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
  const ct = headers.get("Content-Type") || "";
  if (ct.includes("text/html")) {
    return new HTMLRewriter().on("script", {
      element(el) {
        el.setAttribute("nonce", nonce);
      }
    }).transform(out);
  }
  return out;
}
__name(withSecurityHeaders, "withSecurityHeaders");
async function renderRoute(request, env2, route) {
  const baseRequest = new Request(new URL("/", request.url), request);
  const assetResponse = await env2.ASSETS.fetch(baseRequest);
  if (!assetResponse.ok) return assetResponse;
  const canonicalUrl = "https://filmgeneva.ch" + route.url;
  const rewriter = new HTMLRewriter().on("title", {
    element(el) {
      el.setInnerContent(route.title);
    }
  }).on('meta[name="description"]', {
    element(el) {
      el.setAttribute("content", route.desc);
    }
  }).on('meta[name="twitter:title"]', {
    element(el) {
      el.setAttribute("content", route.title);
    }
  }).on('meta[name="twitter:description"]', {
    element(el) {
      el.setAttribute("content", route.desc);
    }
  }).on('meta[property="og:title"]', {
    element(el) {
      el.setAttribute("content", route.title);
    }
  }).on('meta[property="og:description"]', {
    element(el) {
      el.setAttribute("content", route.desc);
    }
  }).on('meta[property="og:url"]', {
    element(el) {
      el.setAttribute("content", canonicalUrl);
    }
  }).on('link[rel="canonical"]', {
    element(el) {
      el.setAttribute("href", canonicalUrl);
    }
  }).on("div.page#page-home", {
    element(el) {
      if (route.key !== "home") {
        el.setAttribute("class", "page");
      }
    }
  }).on(`div.page#page-${route.key}`, {
    element(el) {
      if (route.key !== "home") {
        el.setAttribute("class", "page active");
      }
    }
  });
  const rewritten = rewriter.transform(assetResponse);
  return withSecurityHeaders(rewritten);
}
__name(renderRoute, "renderRoute");
var worker_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (url.hostname === "filmgeneva.com" || url.hostname === "www.filmgeneva.com") {
      return Response.redirect("https://filmgeneva.ch" + url.pathname + url.search, 301);
    }
    if (url.hostname === "www.filmgeneva.ch") {
      return Response.redirect("https://filmgeneva.ch" + url.pathname + url.search, 301);
    }
    if (path === "/robots.txt") {
      return withSecurityHeaders(new Response(ROBOTS_TXT, {
        headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=86400" }
      }));
    }
    if (path === "/llms.txt") {
      return withSecurityHeaders(new Response(LLMS_TXT, {
        headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=86400" }
      }));
    }
    if (path === "/sitemap.xml") {
      return withSecurityHeaders(new Response(SITEMAP_XML, {
        headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=86400" }
      }));
    }
    if (path.startsWith("/api/photos/")) {
      const folder = decodeURIComponent(path.slice("/api/photos/".length)).replace(/\/$/, "");
      if (!folder) {
        return new Response(JSON.stringify({ error: "No folder specified" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const list = await env2.PHOTOS_BUCKET.list({ prefix: folder + "/" });
        const photos = list.objects.filter((obj) => !obj.key.endsWith("/")).filter((obj) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(obj.key)).filter((obj) => !obj.key.includes("/thumbnails/")).map((obj) => ({ url: "/photos/" + obj.key, key: obj.key, size: obj.size }));
        return withSecurityHeaders(new Response(JSON.stringify({ folder, count: photos.length, photos }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
            "Access-Control-Allow-Origin": "*"
          }
        }));
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (path.startsWith("/photos/")) {
      const key = decodeURIComponent(path.slice("/photos/".length));
      if (!key || key.endsWith("/")) return new Response("Not Found", { status: 404 });
      try {
        const rangeHeader = request.headers.get("Range");
        const object = rangeHeader ? await env2.PHOTOS_BUCKET.get(key, { range: request.headers }) : await env2.PHOTOS_BUCKET.get(key);
        if (!object) return new Response("Photo not found", { status: 404 });
        const headers = new Headers({
          "Content-Type": getContentType(key),
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
          "ETag": object.etag || ""
        });
        if (object.size) headers.set("Content-Length", object.size.toString());
        return new Response(object.body, { status: rangeHeader ? 206 : 200, headers });
      } catch (err) {
        return new Response("Error fetching photo", { status: 500 });
      }
    }
    const matchPath = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
    const route = ROUTE_MAP[matchPath];
    if (route && route.key !== "home") {
      try {
        return await renderRoute(request, env2, route);
      } catch (err) {
      }
    }
    try {
      const assetResponse = await env2.ASSETS.fetch(request);
      return withSecurityHeaders(assetResponse);
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
