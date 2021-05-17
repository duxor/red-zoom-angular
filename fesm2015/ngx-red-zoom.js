import { Directive, ElementRef, Renderer2, NgZone, Inject, PLATFORM_ID, Input, HostBinding, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const ɵ0 = () => {
    let template = null;
    return () => {
        if (!template) {
            template = document.createElement('template');
            template.innerHTML = `<div class="red-zoom">
                <div class="red-zoom__overlay"></div>
                <div class="red-zoom__frame">
                    <div class="red-zoom__frame-body"></div>
                </div>
                <div class="red-zoom__lens">
                    <div class="red-zoom__lens-body"></div>
                </div>
                <div class="red-zoom__error">
                    <div class="red-zoom__error-message"></div>
                </div>
            </div>`;
        }
        return template.content.cloneNode(true).firstChild;
    };
};
const makeTemplate = (ɵ0)();
class RedZoomTemplate {
    constructor() {
        this._status = null;
        this.appliedClasses = [];
        this.onTransitionEnd = (event) => {
            if (event.propertyName === 'visibility' && this.isHidden) {
                this.template.remove();
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
    set status(state) {
        if (this._status !== null) {
            this.template.classList.remove(`red-zoom--status--${this._status}`);
        }
        this._status = state;
        this.template.classList.add(`red-zoom--status--${state}`);
    }
    get status() {
        return this._status;
    }
    set classes(classes) {
        this.template.classList.remove(...this.appliedClasses);
        classes = classes.trim();
        if (classes) {
            this.appliedClasses = classes.replace(/ +/, ' ').split(' ');
            this.template.classList.add(...this.appliedClasses);
        }
    }
    get isHidden() {
        return getComputedStyle(this.template).visibility === 'hidden';
    }
    setProperties(properties) {
        for (let name in properties) {
            this.template.style.setProperty(name, properties[name]);
        }
    }
    detach() {
        this.template.classList.remove('red-zoom--active');
        if (this.isHidden) {
            this.template.remove();
        }
    }
    attach() {
        if (this.template.parentNode !== document.body) {
            document.body.appendChild(this.template);
        }
    }
    activate() {
        this.template.classList.add('red-zoom--active');
    }
}

class RedZoomImage {
    constructor(element = null, listener = () => { }, className = null) {
        this.element = element;
        this.listener = listener;
        this.loading = false;
        this.isFirst = true;
        if (element === null) {
            this.element = document.createElement('img');
        }
        const _listener = () => {
            if (this.status !== 'loading') {
                this.isFirst = false;
            }
            this.listener();
        };
        this.element.addEventListener('load', _listener);
        this.element.addEventListener('error', _listener);
        this.destroy = () => {
            this.element.removeEventListener('load', _listener);
            this.element.removeEventListener('error', _listener);
        };
        if (className !== null) {
            this.element.classList.add(className);
        }
    }
    get width() {
        return this.element.width;
    }
    get height() {
        return this.element.height;
    }
    get size() {
        return { x: this.width, y: this.height };
    }
    get naturalWidth() {
        return this.element.naturalWidth;
    }
    get naturalHeight() {
        return this.element.naturalHeight;
    }
    get naturalSize() {
        return { x: this.naturalWidth, y: this.naturalHeight };
    }
    get style() {
        return this.element.style;
    }
    set styleSize(value) {
        this.element.style.width = value.x;
        this.element.style.height = value.y;
    }
    get status() {
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
    }
    set src(value) {
        this.loading = false;
        this.element.setAttribute('src', value);
    }
    reset() {
        this.loading = true;
        this.listener();
    }
}

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

class RedZoomDirective {
    constructor(element, renderer, zone, platformId) {
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
        this.unlisten = () => { };
        this.onImageChangeStatus = (() => {
            let previousStatus;
            return () => {
                if (previousStatus === this.status) {
                    return;
                }
                previousStatus = this.status;
                this.onImageChangeStatusDistinct();
            };
        })();
        this.onImageChangeStatusDistinct = () => {
            this.template.status = this.status;
            if (this.status === 'loaded') {
                this.template.setProperties({
                    '--red-zoom-lens-image-natural-w': `${this.lensImage.naturalWidth}px`,
                    '--red-zoom-lens-image-natural-h': `${this.lensImage.naturalHeight}px`,
                });
                if (this.session && this.session.active) {
                    this.calcScaleFactor();
                    this.calcFrameSize();
                    this.move();
                    this.scaleFactor = this.lensImage.width / this.lensImage.naturalWidth;
                }
            }
        };
        this.mouseEnter = (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            if (this.session) {
                this.session.destroy();
            }
            this.session = {
                active: false,
                thumbSize: null,
                thumbPos: null,
                lensContainerSize: null,
                lensImageSize: null,
                frameSize: null,
                mousePos: fromMouseEvent(event),
                destroy: () => { },
            };
            const onWheel = (wheelEvent) => {
                if (!wheelEvent.cancelable || this.status !== 'loaded' || !this.wheel) {
                    return;
                }
                wheelEvent.preventDefault();
                const delta = Math.sign(wheelEvent.deltaY);
                const nextScaleFactor = this.scaleFactor + .01 * -delta;
                console.log(nextScaleFactor);
                if (this.minScaleFactor !== undefined && nextScaleFactor < this.minScaleFactor) {
                    return;
                }
                if (this.maxScaleFactor !== undefined && nextScaleFactor > this.maxScaleFactor) {
                    return;
                }
                this.scaleFactor += .01 * -delta;
                this.calcScaleFactor();
                this.calcFrameSize();
                this.onMouseMove(this.behavior === 'click' ? this.session.mousePos : fromMouseEvent(wheelEvent));
            };
            const onMove = (mouseEvent) => {
                this.onMouseMove(fromMouseEvent(mouseEvent));
            };
            const onLeave = () => {
                this.session = null;
                this.template.detach();
                unListenMove();
                unListenLeave();
                unListenWheel();
            };
            let unListenMove;
            let unListenLeave;
            let unListenWheel;
            if (this.behavior === 'hover') {
                unListenMove = this.renderer.listen(this.element.nativeElement, 'mousemove', onMove);
                unListenLeave = this.renderer.listen(this.element.nativeElement, 'mouseleave', onLeave);
            }
            else if (this.behavior === 'click') {
                unListenMove = () => { };
                unListenLeave = this.renderer.listen(document, 'mousedown', (event) => {
                    const element = this.element.nativeElement;
                    if (!element.contains(event.target)) {
                        onLeave();
                    }
                });
            }
            else {
                unListenMove = this.renderer.listen(document, 'mousemove', onMove);
                unListenLeave = this.renderer.listen(document, 'mouseup', onLeave);
            }
            unListenWheel = this.renderer.listen(this.element.nativeElement, 'wheel', onWheel);
            this.onMouseMove(fromMouseEvent(event));
            this.forceReflow();
            this.template.activate();
            if (this.status !== 'loaded') {
                this.loadLensImage();
                this.loadFrameImage();
            }
            this.session.destroy = onLeave;
        };
        this.onMouseMove = (mousePos) => {
            if (this.isImage && this.thumbImage.status !== 'loaded' && this.thumbImage.isFirst) {
                return;
            }
            if (!this.session.active) {
                this.session.active = true;
                this.initSession();
            }
            this.session.mousePos = mousePos;
            if (this.status === 'loaded') {
                cancelAnimationFrame(this.requestAnimationFrameId);
                this.requestAnimationFrameId = requestAnimationFrame(() => this.move());
            }
        };
    }
    get isImage() {
        return this.element.nativeElement.tagName === 'IMG';
    }
    get status() {
        let status = 'loaded';
        const images = [this.frameImage, this.lensImage];
        if (this.isImage) {
            images.push(this.thumbImage);
        }
        for (let image of images) {
            if (status === 'error' || image.status === 'error') {
                status = 'error';
            }
            else if (status === 'loading' || image.status === 'loading') {
                status = 'loading';
            }
        }
        return status;
    }
    listen() {
        const startEventName = {
            'hover': 'mouseenter',
            'grab': 'mousedown',
            'click': 'mousedown',
        }[this.behavior];
        this.unlisten();
        this.unlisten = this.renderer.listen(this.element.nativeElement, startEventName, this.mouseEnter);
    }
    ngAfterContentInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            this.template = new RedZoomTemplate();
            this.template.classes = this.classes;
            this.template.errorMessage.innerHTML = this.errorMessage;
            if (this.isImage) {
                this.thumbImage = new RedZoomImage(this.element.nativeElement, this.onImageChangeStatus);
            }
            this.frameImage = new RedZoomImage(null, this.onImageChangeStatus, 'red-zoom__frame-image');
            this.lensImage = new RedZoomImage(null, this.onImageChangeStatus, 'red-zoom__lens-image');
            if (!this.lazy) {
                this.loadFrameImage();
                this.loadLensImage();
            }
            this.listen();
        });
    }
    ngOnChanges(changes) {
        if (!isPlatformBrowser(this.platformId)) {
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
    }
    ngOnDestroy() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (this.session) {
            this.session.destroy();
        }
    }
    onChangeThumbSrc() {
        this.frameImage.reset();
        if (!this.lazy || this.session) {
            this.loadFrameImage();
        }
    }
    onChangeLensSrc() {
        this.lensImage.reset();
        if (!this.lazy || this.session) {
            this.loadLensImage();
        }
    }
    getThumbSrc() {
        if (!this.isImage || !this.src) {
            return this.thumbSrc;
        }
        return this.src;
    }
    loadLensImage() {
        if (this.lensImage.status !== 'loaded') {
            this.lensImage.src = this.lensSrc;
        }
    }
    loadFrameImage() {
        if (this.frameImage.status !== 'loaded') {
            this.frameImage.src = this.getThumbSrc();
        }
    }
    initSession() {
        const thumbRect = this.element.nativeElement.getBoundingClientRect();
        this.session.thumbSize = fromRectSize(thumbRect);
        this.session.thumbPos = add(fromRectPos(thumbRect), fromScroll());
        this.template.attach();
        this.template.lensBody.appendChild(this.lensImage.element);
        this.template.frameBody.appendChild(this.frameImage.element);
        this.template.setProperties({
            '--red-zoom-thumb-x': `${this.session.thumbPos.x}px`,
            '--red-zoom-thumb-y': `${this.session.thumbPos.y}px`,
            '--red-zoom-thumb-w': `${this.session.thumbSize.x}px`,
            '--red-zoom-thumb-h': `${this.session.thumbSize.y}px`,
            '--red-zoom-thumb-size-max': `${flatMax(this.session.thumbSize)}px`,
            '--red-zoom-thumb-size-min': `${flatMin(this.session.thumbSize)}px`,
        });
        if (this.status === 'loaded') {
            this.calcScaleFactor();
            this.calcFrameSize();
            this.scaleFactor = this.lensImage.width / this.lensImage.naturalWidth;
        }
    }
    calcScaleFactor() {
        const scaledSize = mul(this.lensImage.naturalSize, this.scaleFactor);
        this.lensImage.styleSize = map(scaledSize, c => `${c}px`);
        const scaleFactorIsLimited = flatOr(notEqual(this.lensImage.size, round(scaledSize)));
        if (scaleFactorIsLimited) {
            this.scaleFactor = flatMax(div(this.lensImage.size, this.lensImage.naturalSize));
            this.lensImage.styleSize = map(mul(this.lensImage.naturalSize, this.scaleFactor), c => `${c}px`);
        }
    }
    calcFrameSize() {
        this.session.lensContainerSize = fromRectSize(this.template.lensBody.getBoundingClientRect());
        this.session.lensImageSize = fromRectSize(this.lensImage.element.getBoundingClientRect());
        this.session.frameSize = min(this.session.thumbSize, round(mul(this.session.thumbSize, div(this.session.lensContainerSize, this.session.lensImageSize))));
        this.template.setProperties({
            '--red-zoom-frame-w': `${this.session.frameSize.x}px`,
            '--red-zoom-frame-h': `${this.session.frameSize.y}px`,
        });
    }
    move() {
        if (!this.session || !this.session.active) {
            return;
        }
        const { mousePos, thumbSize, thumbPos, frameSize, lensContainerSize, lensImageSize } = this.session;
        this.template.setProperties({
            '--red-zoom-mouse-x': `${mousePos.x}px`,
            '--red-zoom-mouse-y': `${mousePos.y}px`,
        });
        const framePos = sub(mousePos, div(frameSize, 2));
        const frameLimitedPos = min(max(framePos, thumbPos), sub(add(thumbPos, thumbSize), frameSize));
        const frameImagePos = sub(thumbPos, round(frameLimitedPos));
        this.template.setProperties({
            '--red-zoom-frame-x': `${Math.round(frameLimitedPos.x)}px`,
            '--red-zoom-frame-y': `${Math.round(frameLimitedPos.y)}px`,
            '--red-zoom-frame-image-x': `${Math.round(frameImagePos.x)}px`,
            '--red-zoom-frame-image-y': `${Math.round(frameImagePos.y)}px`,
        });
        const frameRelativePos = map(sub(thumbSize, frameSize), (value, axis) => {
            return value === 0 ? 0 : (frameLimitedPos[axis] - thumbPos[axis]) / value;
        });
        const lensImagePos = mul(frameRelativePos, sub(lensImageSize, lensContainerSize));
        const lensImageCenterOffset = max(div(sub(lensContainerSize, lensImageSize), 2), 0);
        const lensImageFrameOffset = mul(div(sub(framePos, frameLimitedPos), div(frameSize, 2)), div(lensContainerSize, 2));
        this.template.setProperties({
            '--red-zoom-lens-image-base-x': `${-lensImagePos.x}px`,
            '--red-zoom-lens-image-base-y': `${-lensImagePos.y}px`,
            '--red-zoom-lens-image-center-offset-x': `${lensImageCenterOffset.x}px`,
            '--red-zoom-lens-image-center-offset-y': `${lensImageCenterOffset.y}px`,
            '--red-zoom-lens-image-frame-offset-x': `${-lensImageFrameOffset.x}px`,
            '--red-zoom-lens-image-frame-offset-y': `${-lensImageFrameOffset.y}px`,
        });
    }
    invalidate() {
        if (this.session && this.session.active) {
            this.initSession();
            this.move();
        }
    }
    forceReflow() {
        this.element.nativeElement.getBoundingClientRect();
    }
}
RedZoomDirective.decorators = [
    { type: Directive, args: [{
                selector: '[redZoom]',
                exportAs: 'redZoom',
            },] }
];
RedZoomDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgZone },
    { type: String, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
RedZoomDirective.propDecorators = {
    src: [{ type: Input, args: ['src',] }, { type: HostBinding, args: ['attr.src',] }],
    lensSrc: [{ type: Input, args: ['redZoom',] }],
    thumbSrc: [{ type: Input, args: ['redZoomThumb',] }],
    lazy: [{ type: Input, args: ['redZoomLazy',] }],
    classes: [{ type: Input, args: ['redZoomClass',] }],
    behavior: [{ type: Input, args: ['redZoomBehavior',] }],
    wheel: [{ type: Input, args: ['redZoomMouseWheel',] }],
    minScaleFactor: [{ type: Input }],
    maxScaleFactor: [{ type: Input }],
    errorMessage: [{ type: Input, args: ['redZoomErrorMessage',] }]
};

class RedZoomModule {
}
RedZoomModule.decorators = [
    { type: NgModule, args: [{
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

export { RedZoomDirective, RedZoomModule };
//# sourceMappingURL=ngx-red-zoom.js.map
