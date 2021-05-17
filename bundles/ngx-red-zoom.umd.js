(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-red-zoom', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-red-zoom'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var ɵ0 = function () {
        var template = null;
        return function () {
            if (!template) {
                template = document.createElement('template');
                template.innerHTML = "<div class=\"red-zoom\">\n                <div class=\"red-zoom__overlay\"></div>\n                <div class=\"red-zoom__frame\">\n                    <div class=\"red-zoom__frame-body\"></div>\n                </div>\n                <div class=\"red-zoom__lens\">\n                    <div class=\"red-zoom__lens-body\"></div>\n                </div>\n                <div class=\"red-zoom__error\">\n                    <div class=\"red-zoom__error-message\"></div>\n                </div>\n            </div>";
            }
            return template.content.cloneNode(true).firstChild;
        };
    };
    var makeTemplate = (ɵ0)();
    var RedZoomTemplate = /** @class */ (function () {
        function RedZoomTemplate() {
            var _this = this;
            this._status = null;
            this.appliedClasses = [];
            this.onTransitionEnd = function (event) {
                if (event.propertyName === 'visibility' && _this.isHidden) {
                    _this.template.remove();
                }
            };
            this.template = makeTemplate();
            this.lens = this.template.querySelector('.red-zoom__lens');
            this.lensBody = this.template.querySelector('.red-zoom__lens-body');
            this.frame = this.template.querySelector('.red-zoom__frame');
            this.frameBody = this.template.querySelector('.red-zoom__frame-body');
            this.error = this.template.querySelector('.red-zoom__error');
            this.errorMessage = this.template.querySelector('.red-zoom__error-message');
            this.template.addEventListener('transitionend', this.onTransitionEnd);
            this.status = 'loading';
        }
        Object.defineProperty(RedZoomTemplate.prototype, "status", {
            get: function () {
                return this._status;
            },
            set: function (state) {
                if (this._status !== null) {
                    this.template.classList.remove("red-zoom--status--" + this._status);
                }
                this._status = state;
                this.template.classList.add("red-zoom--status--" + state);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomTemplate.prototype, "classes", {
            set: function (classes) {
                var _a, _b;
                (_a = this.template.classList).remove.apply(_a, __spread(this.appliedClasses));
                classes = classes.trim();
                if (classes) {
                    this.appliedClasses = classes.replace(/ +/, ' ').split(' ');
                    (_b = this.template.classList).add.apply(_b, __spread(this.appliedClasses));
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomTemplate.prototype, "isHidden", {
            get: function () {
                return getComputedStyle(this.template).visibility === 'hidden';
            },
            enumerable: false,
            configurable: true
        });
        RedZoomTemplate.prototype.setProperties = function (properties) {
            for (var name in properties) {
                this.template.style.setProperty(name, properties[name]);
            }
        };
        RedZoomTemplate.prototype.detach = function () {
            this.template.classList.remove('red-zoom--active');
            if (this.isHidden) {
                this.template.remove();
            }
        };
        RedZoomTemplate.prototype.attach = function () {
            if (this.template.parentNode !== document.body) {
                document.body.appendChild(this.template);
            }
        };
        RedZoomTemplate.prototype.activate = function () {
            this.template.classList.add('red-zoom--active');
        };
        return RedZoomTemplate;
    }());

    var RedZoomImage = /** @class */ (function () {
        function RedZoomImage(element, listener, className) {
            var _this = this;
            if (element === void 0) { element = null; }
            if (listener === void 0) { listener = function () { }; }
            if (className === void 0) { className = null; }
            this.element = element;
            this.listener = listener;
            this.loading = false;
            this.isFirst = true;
            if (element === null) {
                this.element = document.createElement('img');
            }
            var _listener = function () {
                if (_this.status !== 'loading') {
                    _this.isFirst = false;
                }
                _this.listener();
            };
            this.element.addEventListener('load', _listener);
            this.element.addEventListener('error', _listener);
            this.destroy = function () {
                _this.element.removeEventListener('load', _listener);
                _this.element.removeEventListener('error', _listener);
            };
            if (className !== null) {
                this.element.classList.add(className);
            }
        }
        Object.defineProperty(RedZoomImage.prototype, "width", {
            get: function () {
                return this.element.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "height", {
            get: function () {
                return this.element.height;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "size", {
            get: function () {
                return { x: this.width, y: this.height };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "naturalWidth", {
            get: function () {
                return this.element.naturalWidth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "naturalHeight", {
            get: function () {
                return this.element.naturalHeight;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "naturalSize", {
            get: function () {
                return { x: this.naturalWidth, y: this.naturalHeight };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "style", {
            get: function () {
                return this.element.style;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "styleSize", {
            set: function (value) {
                this.element.style.width = value.x;
                this.element.style.height = value.y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "status", {
            get: function () {
                if (this.loading) {
                    return 'loading';
                }
                if (this.element.complete) {
                    if (!this.element.src) {
                        return 'loading';
                    }
                    else if (this.naturalWidth === 0) {
                        return 'error';
                    }
                    return 'loaded';
                }
                return 'loading';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomImage.prototype, "src", {
            set: function (value) {
                this.loading = false;
                this.element.setAttribute('src', value);
            },
            enumerable: false,
            configurable: true
        });
        RedZoomImage.prototype.reset = function () {
            this.loading = true;
            this.listener();
        };
        return RedZoomImage;
    }());

    function calc(a, op, b) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case 'min': return Math.min(a, b);
            case 'max': return Math.max(a, b);
        }
    }
    function fromRectPos(rect) {
        return { x: rect.left, y: rect.top };
    }
    function fromRectSize(rect) {
        return { x: rect.width, y: rect.height };
    }
    function fromScroll() {
        return { x: scrollX, y: scrollY };
    }
    function fromMouseEvent(event) {
        return add({ x: event.clientX, y: event.clientY }, fromScroll());
    }
    function op(a, op, b) {
        if (typeof b === 'number') {
            b = { x: b, y: b };
        }
        return {
            x: calc(a.x, op, b.x),
            y: calc(a.y, op, b.y)
        };
    }
    function add(a, b) {
        return op(a, '+', b);
    }
    function sub(a, b) {
        return op(a, '-', b);
    }
    function mul(a, b) {
        return op(a, '*', b);
    }
    function div(a, b) {
        return op(a, '/', b);
    }
    function min(a, b) {
        return op(a, 'min', b);
    }
    function max(a, b) {
        return op(a, 'max', b);
    }
    function round(a) {
        return map(a, Math.round);
    }
    function map(a, fn) {
        return { x: fn(a.x, 'x'), y: fn(a.y, 'y') };
    }
    function equal(a, b) {
        if (typeof b === 'number') {
            b = { x: b, y: b };
        }
        return {
            x: a.x === b.x,
            y: a.y === b.y,
        };
    }
    function notEqual(a, b) {
        return { x: a.x !== b.x, y: a.y !== b.y };
    }
    function flatMax(a) {
        return Math.max(a.x, a.y);
    }
    function flatMin(a) {
        return Math.min(a.x, a.y);
    }
    function flatOr(a) {
        return a.x || a.y;
    }

    var RedZoomDirective = /** @class */ (function () {
        function RedZoomDirective(element, renderer, zone, platformId) {
            var _this = this;
            this.element = element;
            this.renderer = renderer;
            this.zone = zone;
            this.platformId = platformId;
            this.lazy = false;
            this.classes = '';
            this.behavior = 'hover';
            this.wheel = true;
            this.errorMessage = 'An error occurred while loading the image.';
            this.scaleFactor = 1;
            this.requestAnimationFrameId = null;
            this.unlisten = function () { };
            this.onImageChangeStatus = (function () {
                var previousStatus;
                return function () {
                    if (previousStatus === _this.status) {
                        return;
                    }
                    previousStatus = _this.status;
                    _this.onImageChangeStatusDistinct();
                };
            })();
            this.onImageChangeStatusDistinct = function () {
                _this.template.status = _this.status;
                if (_this.status === 'loaded') {
                    _this.template.setProperties({
                        '--red-zoom-lens-image-natural-w': _this.lensImage.naturalWidth + "px",
                        '--red-zoom-lens-image-natural-h': _this.lensImage.naturalHeight + "px",
                    });
                    if (_this.session && _this.session.active) {
                        _this.calcScaleFactor();
                        _this.calcFrameSize();
                        _this.move();
                        _this.scaleFactor = _this.lensImage.width / _this.lensImage.naturalWidth;
                    }
                }
            };
            this.mouseEnter = function (event) {
                if (event.cancelable) {
                    event.preventDefault();
                }
                if (_this.session) {
                    _this.session.destroy();
                }
                _this.session = {
                    active: false,
                    thumbSize: null,
                    thumbPos: null,
                    lensContainerSize: null,
                    lensImageSize: null,
                    frameSize: null,
                    mousePos: fromMouseEvent(event),
                    destroy: function () { },
                };
                var onWheel = function (wheelEvent) {
                    if (!wheelEvent.cancelable || _this.status !== 'loaded' || !_this.wheel) {
                        return;
                    }
                    wheelEvent.preventDefault();
                    var delta = Math.sign(wheelEvent.deltaY);
                    var nextScaleFactor = _this.scaleFactor + .01 * -delta;
                    console.log(nextScaleFactor);
                    if (_this.minScaleFactor !== undefined && nextScaleFactor < _this.minScaleFactor) {
                        return;
                    }
                    if (_this.maxScaleFactor !== undefined && nextScaleFactor > _this.maxScaleFactor) {
                        return;
                    }
                    _this.scaleFactor += .01 * -delta;
                    _this.calcScaleFactor();
                    _this.calcFrameSize();
                    _this.onMouseMove(_this.behavior === 'click' ? _this.session.mousePos : fromMouseEvent(wheelEvent));
                };
                var onMove = function (mouseEvent) {
                    _this.onMouseMove(fromMouseEvent(mouseEvent));
                };
                var onLeave = function () {
                    _this.session = null;
                    _this.template.detach();
                    unListenMove();
                    unListenLeave();
                    unListenWheel();
                };
                var unListenMove;
                var unListenLeave;
                var unListenWheel;
                if (_this.behavior === 'hover') {
                    unListenMove = _this.renderer.listen(_this.element.nativeElement, 'mousemove', onMove);
                    unListenLeave = _this.renderer.listen(_this.element.nativeElement, 'mouseleave', onLeave);
                }
                else if (_this.behavior === 'click') {
                    unListenMove = function () { };
                    unListenLeave = _this.renderer.listen(document, 'mousedown', function (event) {
                        var element = _this.element.nativeElement;
                        if (!element.contains(event.target)) {
                            onLeave();
                        }
                    });
                }
                else {
                    unListenMove = _this.renderer.listen(document, 'mousemove', onMove);
                    unListenLeave = _this.renderer.listen(document, 'mouseup', onLeave);
                }
                unListenWheel = _this.renderer.listen(_this.element.nativeElement, 'wheel', onWheel);
                _this.onMouseMove(fromMouseEvent(event));
                _this.forceReflow();
                _this.template.activate();
                if (_this.status !== 'loaded') {
                    _this.loadLensImage();
                    _this.loadFrameImage();
                }
                _this.session.destroy = onLeave;
            };
            this.onMouseMove = function (mousePos) {
                if (_this.isImage && _this.thumbImage.status !== 'loaded' && _this.thumbImage.isFirst) {
                    return;
                }
                if (!_this.session.active) {
                    _this.session.active = true;
                    _this.initSession();
                }
                _this.session.mousePos = mousePos;
                if (_this.status === 'loaded') {
                    cancelAnimationFrame(_this.requestAnimationFrameId);
                    _this.requestAnimationFrameId = requestAnimationFrame(function () { return _this.move(); });
                }
            };
        }
        Object.defineProperty(RedZoomDirective.prototype, "isImage", {
            get: function () {
                return this.element.nativeElement.tagName === 'IMG';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RedZoomDirective.prototype, "status", {
            get: function () {
                var e_1, _a;
                var status = 'loaded';
                var images = [this.frameImage, this.lensImage];
                if (this.isImage) {
                    images.push(this.thumbImage);
                }
                try {
                    for (var images_1 = __values(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
                        var image = images_1_1.value;
                        if (status === 'error' || image.status === 'error') {
                            status = 'error';
                        }
                        else if (status === 'loading' || image.status === 'loading') {
                            status = 'loading';
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (images_1_1 && !images_1_1.done && (_a = images_1.return)) _a.call(images_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return status;
            },
            enumerable: false,
            configurable: true
        });
        RedZoomDirective.prototype.listen = function () {
            var startEventName = {
                'hover': 'mouseenter',
                'grab': 'mousedown',
                'click': 'mousedown',
            }[this.behavior];
            this.unlisten();
            this.unlisten = this.renderer.listen(this.element.nativeElement, startEventName, this.mouseEnter);
        };
        RedZoomDirective.prototype.ngAfterContentInit = function () {
            var _this = this;
            if (!common.isPlatformBrowser(this.platformId)) {
                return;
            }
            this.zone.runOutsideAngular(function () {
                _this.template = new RedZoomTemplate();
                _this.template.classes = _this.classes;
                _this.template.errorMessage.innerHTML = _this.errorMessage;
                if (_this.isImage) {
                    _this.thumbImage = new RedZoomImage(_this.element.nativeElement, _this.onImageChangeStatus);
                }
                _this.frameImage = new RedZoomImage(null, _this.onImageChangeStatus, 'red-zoom__frame-image');
                _this.lensImage = new RedZoomImage(null, _this.onImageChangeStatus, 'red-zoom__lens-image');
                if (!_this.lazy) {
                    _this.loadFrameImage();
                    _this.loadLensImage();
                }
                _this.listen();
            });
        };
        RedZoomDirective.prototype.ngOnChanges = function (changes) {
            if (!common.isPlatformBrowser(this.platformId)) {
                return;
            }
            if ('src' in changes && !changes.src.firstChange) {
                this.onChangeThumbSrc();
            }
            if ('thumbSrc' in changes && !changes.thumbSrc.firstChange) {
                this.onChangeThumbSrc();
            }
            if ('lensSrc' in changes && !changes.lensSrc.firstChange) {
                this.onChangeLensSrc();
            }
            if ('behavior' in changes && !changes.behavior.firstChange) {
                this.listen();
            }
            if ('classes' in changes && !changes.classes.firstChange) {
                this.template.classes = this.classes;
                this.invalidate();
            }
            if ('errorMessage' in changes && !changes.errorMessage.firstChange) {
                this.template.errorMessage.innerHTML = this.errorMessage;
            }
        };
        RedZoomDirective.prototype.ngOnDestroy = function () {
            if (!common.isPlatformBrowser(this.platformId)) {
                return;
            }
            if (this.session) {
                this.session.destroy();
            }
        };
        RedZoomDirective.prototype.onChangeThumbSrc = function () {
            this.frameImage.reset();
            if (!this.lazy || this.session) {
                this.loadFrameImage();
            }
        };
        RedZoomDirective.prototype.onChangeLensSrc = function () {
            this.lensImage.reset();
            if (!this.lazy || this.session) {
                this.loadLensImage();
            }
        };
        RedZoomDirective.prototype.getThumbSrc = function () {
            if (!this.isImage || !this.src) {
                return this.thumbSrc;
            }
            return this.src;
        };
        RedZoomDirective.prototype.loadLensImage = function () {
            if (this.lensImage.status !== 'loaded') {
                this.lensImage.src = this.lensSrc;
            }
        };
        RedZoomDirective.prototype.loadFrameImage = function () {
            if (this.frameImage.status !== 'loaded') {
                this.frameImage.src = this.getThumbSrc();
            }
        };
        RedZoomDirective.prototype.initSession = function () {
            var thumbRect = this.element.nativeElement.getBoundingClientRect();
            this.session.thumbSize = fromRectSize(thumbRect);
            this.session.thumbPos = add(fromRectPos(thumbRect), fromScroll());
            this.template.attach();
            this.template.lensBody.appendChild(this.lensImage.element);
            this.template.frameBody.appendChild(this.frameImage.element);
            this.template.setProperties({
                '--red-zoom-thumb-x': this.session.thumbPos.x + "px",
                '--red-zoom-thumb-y': this.session.thumbPos.y + "px",
                '--red-zoom-thumb-w': this.session.thumbSize.x + "px",
                '--red-zoom-thumb-h': this.session.thumbSize.y + "px",
                '--red-zoom-thumb-size-max': flatMax(this.session.thumbSize) + "px",
                '--red-zoom-thumb-size-min': flatMin(this.session.thumbSize) + "px",
            });
            if (this.status === 'loaded') {
                this.calcScaleFactor();
                this.calcFrameSize();
                this.scaleFactor = this.lensImage.width / this.lensImage.naturalWidth;
            }
        };
        RedZoomDirective.prototype.calcScaleFactor = function () {
            var scaledSize = mul(this.lensImage.naturalSize, this.scaleFactor);
            this.lensImage.styleSize = map(scaledSize, function (c) { return c + "px"; });
            var scaleFactorIsLimited = flatOr(notEqual(this.lensImage.size, round(scaledSize)));
            if (scaleFactorIsLimited) {
                this.scaleFactor = flatMax(div(this.lensImage.size, this.lensImage.naturalSize));
                this.lensImage.styleSize = map(mul(this.lensImage.naturalSize, this.scaleFactor), function (c) { return c + "px"; });
            }
        };
        RedZoomDirective.prototype.calcFrameSize = function () {
            this.session.lensContainerSize = fromRectSize(this.template.lensBody.getBoundingClientRect());
            this.session.lensImageSize = fromRectSize(this.lensImage.element.getBoundingClientRect());
            this.session.frameSize = min(this.session.thumbSize, round(mul(this.session.thumbSize, div(this.session.lensContainerSize, this.session.lensImageSize))));
            this.template.setProperties({
                '--red-zoom-frame-w': this.session.frameSize.x + "px",
                '--red-zoom-frame-h': this.session.frameSize.y + "px",
            });
        };
        RedZoomDirective.prototype.move = function () {
            if (!this.session || !this.session.active) {
                return;
            }
            var _a = this.session, mousePos = _a.mousePos, thumbSize = _a.thumbSize, thumbPos = _a.thumbPos, frameSize = _a.frameSize, lensContainerSize = _a.lensContainerSize, lensImageSize = _a.lensImageSize;
            this.template.setProperties({
                '--red-zoom-mouse-x': mousePos.x + "px",
                '--red-zoom-mouse-y': mousePos.y + "px",
            });
            var framePos = sub(mousePos, div(frameSize, 2));
            var frameLimitedPos = min(max(framePos, thumbPos), sub(add(thumbPos, thumbSize), frameSize));
            var frameImagePos = sub(thumbPos, round(frameLimitedPos));
            this.template.setProperties({
                '--red-zoom-frame-x': Math.round(frameLimitedPos.x) + "px",
                '--red-zoom-frame-y': Math.round(frameLimitedPos.y) + "px",
                '--red-zoom-frame-image-x': Math.round(frameImagePos.x) + "px",
                '--red-zoom-frame-image-y': Math.round(frameImagePos.y) + "px",
            });
            var frameRelativePos = map(sub(thumbSize, frameSize), function (value, axis) {
                return value === 0 ? 0 : (frameLimitedPos[axis] - thumbPos[axis]) / value;
            });
            var lensImagePos = mul(frameRelativePos, sub(lensImageSize, lensContainerSize));
            var lensImageCenterOffset = max(div(sub(lensContainerSize, lensImageSize), 2), 0);
            var lensImageFrameOffset = mul(div(sub(framePos, frameLimitedPos), div(frameSize, 2)), div(lensContainerSize, 2));
            this.template.setProperties({
                '--red-zoom-lens-image-base-x': -lensImagePos.x + "px",
                '--red-zoom-lens-image-base-y': -lensImagePos.y + "px",
                '--red-zoom-lens-image-center-offset-x': lensImageCenterOffset.x + "px",
                '--red-zoom-lens-image-center-offset-y': lensImageCenterOffset.y + "px",
                '--red-zoom-lens-image-frame-offset-x': -lensImageFrameOffset.x + "px",
                '--red-zoom-lens-image-frame-offset-y': -lensImageFrameOffset.y + "px",
            });
        };
        RedZoomDirective.prototype.invalidate = function () {
            if (this.session && this.session.active) {
                this.initSession();
                this.move();
            }
        };
        RedZoomDirective.prototype.forceReflow = function () {
            this.element.nativeElement.getBoundingClientRect();
        };
        return RedZoomDirective;
    }());
    RedZoomDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[redZoom]',
                    exportAs: 'redZoom',
                },] }
    ];
    RedZoomDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.Renderer2 },
        { type: core.NgZone },
        { type: String, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] }
    ]; };
    RedZoomDirective.propDecorators = {
        src: [{ type: core.Input, args: ['src',] }, { type: core.HostBinding, args: ['attr.src',] }],
        lensSrc: [{ type: core.Input, args: ['redZoom',] }],
        thumbSrc: [{ type: core.Input, args: ['redZoomThumb',] }],
        lazy: [{ type: core.Input, args: ['redZoomLazy',] }],
        classes: [{ type: core.Input, args: ['redZoomClass',] }],
        behavior: [{ type: core.Input, args: ['redZoomBehavior',] }],
        wheel: [{ type: core.Input, args: ['redZoomMouseWheel',] }],
        minScaleFactor: [{ type: core.Input }],
        maxScaleFactor: [{ type: core.Input }],
        errorMessage: [{ type: core.Input, args: ['redZoomErrorMessage',] }]
    };

    var RedZoomModule = /** @class */ (function () {
        function RedZoomModule() {
        }
        return RedZoomModule;
    }());
    RedZoomModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        RedZoomDirective
                    ],
                    exports: [
                        RedZoomDirective
                    ]
                },] }
    ];

    /*
     * Public API Surface of ngx-red-zoom
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.RedZoomDirective = RedZoomDirective;
    exports.RedZoomModule = RedZoomModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-red-zoom.umd.js.map
