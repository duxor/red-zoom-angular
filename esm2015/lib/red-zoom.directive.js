import { Directive, ElementRef, Inject, Input, NgZone, Renderer2, HostBinding, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RedZoomTemplate } from './red-zoom-template.class';
import { RedZoomImage } from './red-zoom-image.class';
import * as vector from './vector';
export class RedZoomDirective {
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
                mousePos: vector.fromMouseEvent(event),
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
                this.onMouseMove(this.behavior === 'click' ? this.session.mousePos : vector.fromMouseEvent(wheelEvent));
            };
            const onMove = (mouseEvent) => {
                this.onMouseMove(vector.fromMouseEvent(mouseEvent));
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
            this.onMouseMove(vector.fromMouseEvent(event));
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
        this.session.thumbSize = vector.fromRectSize(thumbRect);
        this.session.thumbPos = vector.add(vector.fromRectPos(thumbRect), vector.fromScroll());
        this.template.attach();
        this.template.lensBody.appendChild(this.lensImage.element);
        this.template.frameBody.appendChild(this.frameImage.element);
        this.template.setProperties({
            '--red-zoom-thumb-x': `${this.session.thumbPos.x}px`,
            '--red-zoom-thumb-y': `${this.session.thumbPos.y}px`,
            '--red-zoom-thumb-w': `${this.session.thumbSize.x}px`,
            '--red-zoom-thumb-h': `${this.session.thumbSize.y}px`,
            '--red-zoom-thumb-size-max': `${vector.flatMax(this.session.thumbSize)}px`,
            '--red-zoom-thumb-size-min': `${vector.flatMin(this.session.thumbSize)}px`,
        });
        if (this.status === 'loaded') {
            this.calcScaleFactor();
            this.calcFrameSize();
            this.scaleFactor = this.lensImage.width / this.lensImage.naturalWidth;
        }
    }
    calcScaleFactor() {
        const scaledSize = vector.mul(this.lensImage.naturalSize, this.scaleFactor);
        this.lensImage.styleSize = vector.map(scaledSize, c => `${c}px`);
        const scaleFactorIsLimited = vector.flatOr(vector.notEqual(this.lensImage.size, vector.round(scaledSize)));
        if (scaleFactorIsLimited) {
            this.scaleFactor = vector.flatMax(vector.div(this.lensImage.size, this.lensImage.naturalSize));
            this.lensImage.styleSize = vector.map(vector.mul(this.lensImage.naturalSize, this.scaleFactor), c => `${c}px`);
        }
    }
    calcFrameSize() {
        this.session.lensContainerSize = vector.fromRectSize(this.template.lensBody.getBoundingClientRect());
        this.session.lensImageSize = vector.fromRectSize(this.lensImage.element.getBoundingClientRect());
        this.session.frameSize = vector.min(this.session.thumbSize, vector.round(vector.mul(this.session.thumbSize, vector.div(this.session.lensContainerSize, this.session.lensImageSize))));
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
        const framePos = vector.sub(mousePos, vector.div(frameSize, 2));
        const frameLimitedPos = vector.min(vector.max(framePos, thumbPos), vector.sub(vector.add(thumbPos, thumbSize), frameSize));
        const frameImagePos = vector.sub(thumbPos, vector.round(frameLimitedPos));
        this.template.setProperties({
            '--red-zoom-frame-x': `${Math.round(frameLimitedPos.x)}px`,
            '--red-zoom-frame-y': `${Math.round(frameLimitedPos.y)}px`,
            '--red-zoom-frame-image-x': `${Math.round(frameImagePos.x)}px`,
            '--red-zoom-frame-image-y': `${Math.round(frameImagePos.y)}px`,
        });
        const frameRelativePos = vector.map(vector.sub(thumbSize, frameSize), (value, axis) => {
            return value === 0 ? 0 : (frameLimitedPos[axis] - thumbPos[axis]) / value;
        });
        const lensImagePos = vector.mul(frameRelativePos, vector.sub(lensImageSize, lensContainerSize));
        const lensImageCenterOffset = vector.max(vector.div(vector.sub(lensContainerSize, lensImageSize), 2), 0);
        const lensImageFrameOffset = vector.mul(vector.div(vector.sub(framePos, frameLimitedPos), vector.div(frameSize, 2)), vector.div(lensContainerSize, 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkLXpvb20uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1yZWQtem9vbS9zcmMvIiwic291cmNlcyI6WyJsaWIvcmVkLXpvb20uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxXQUFXLEVBQWEsV0FBVyxFQUN0QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBb0JuQyxNQUFNLE9BQU8sZ0JBQWdCO0lBb0R6QixZQUNZLE9BQW1CLEVBQ25CLFFBQW1CLEVBQ25CLElBQVksRUFDUyxVQUFrQjtRQUh2QyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNTLGVBQVUsR0FBVixVQUFVLENBQVE7UUFqRDdCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFFckIsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUVsQixhQUFRLEdBQStCLE9BQU8sQ0FBQztRQUU3QyxVQUFLLEdBQVksSUFBSSxDQUFDO1FBTXBCLGlCQUFZLEdBQVcsNENBQTRDLENBQUM7UUFNbEcsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFFaEIsNEJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBMkMvQixhQUFRLEdBQWdCLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVqQyx3QkFBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUN4QixJQUFJLGNBQWMsQ0FBQztZQUVuQixPQUFPLEdBQUcsRUFBRTtnQkFDUixJQUFJLGNBQWMsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNoQyxPQUFPO2lCQUNWO2dCQUVELGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUU3QixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUN2QyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsRUFBRSxDQUFDO1FBRUwsZ0NBQTJCLEdBQUcsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFFbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0JBQ3hCLGlDQUFpQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLElBQUk7b0JBQ3JFLGlDQUFpQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLElBQUk7aUJBQ3pFLENBQUMsQ0FBQztnQkFFSCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRVosSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztpQkFDekU7YUFDSjtRQUNMLENBQUMsQ0FBQztRQW9HRixlQUFVLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDL0IsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO2dCQUNsQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDMUI7WUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUMxQjtZQUVELElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsaUJBQWlCLEVBQUUsSUFBSTtnQkFDdkIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztnQkFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7YUFDcEIsQ0FBQztZQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBc0IsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ25FLE9BQU87aUJBQ1Y7Z0JBRUQsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUU1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBRXhELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRTdCLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQzVFLE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDNUUsT0FBTztpQkFDVjtnQkFFRCxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFFakMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxXQUFXLENBQ1osSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUN4RixDQUFDO1lBQ04sQ0FBQyxDQUFDO1lBRUYsTUFBTSxNQUFNLEdBQUcsQ0FBQyxVQUFzQixFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQztZQUNGLE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRXZCLFlBQVksRUFBRSxDQUFDO2dCQUNmLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixhQUFhLEVBQUUsQ0FBQztZQUNwQixDQUFDLENBQUM7WUFFRixJQUFJLFlBQVksQ0FBQztZQUNqQixJQUFJLGFBQWEsQ0FBQztZQUNsQixJQUFJLGFBQWEsQ0FBQztZQUVsQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUMzQixZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRixhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzNGO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7Z0JBQ2xDLFlBQVksR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ2xFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBNEIsQ0FBQztvQkFFMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUNqQyxPQUFPLEVBQUUsQ0FBQztxQkFDYjtnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN0RTtZQUVELGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFbkYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFekIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDekI7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRUYsZ0JBQVcsR0FBRyxDQUFDLFFBQXNCLEVBQUUsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUNoRixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBRWpDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLG9CQUFvQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUVuRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDM0U7UUFDTCxDQUFDLENBQUM7SUFuUUUsQ0FBQztJQTVCTCxJQUFJLE9BQU87UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLElBQUksTUFBTSxHQUFrQixRQUFRLENBQUM7UUFDckMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNoQztRQUVELEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQ3RCLElBQUksTUFBTSxLQUFLLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTtnQkFDaEQsTUFBTSxHQUFHLE9BQU8sQ0FBQzthQUNwQjtpQkFBTSxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQzNELE1BQU0sR0FBRyxTQUFTLENBQUM7YUFDdEI7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFTRCxNQUFNO1FBQ0YsTUFBTSxjQUFjLEdBQUc7WUFDbkIsT0FBTyxFQUFFLFlBQVk7WUFDckIsTUFBTSxFQUFFLFdBQVc7WUFDbkIsT0FBTyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RyxDQUFDO0lBcUNELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFekQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDNUY7WUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUUxRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDWixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN4QjtZQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtZQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUMzQjtRQUNELElBQUksVUFBVSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3hELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxTQUFTLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdEQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxVQUFVLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDeEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxTQUFTLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNyQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLGNBQWMsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUM1RDtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7UUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDNUM7SUFDTCxDQUFDO0lBcUhELFdBQVc7UUFDUCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXJFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXZGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDeEIsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUk7WUFDcEQsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUk7WUFDcEQsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUk7WUFDckQsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUk7WUFDckQsMkJBQTJCLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDMUUsMkJBQTJCLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUk7U0FDN0UsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUMxQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXJCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7U0FDekU7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNYLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpFLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQ2pFLENBQUM7UUFFRixJQUFJLG9CQUFvQixFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUUvRixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xIO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBRWpHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUN0QixNQUFNLENBQUMsS0FBSyxDQUNSLE1BQU0sQ0FBQyxHQUFHLENBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQ2pHLENBQ0osQ0FDSixDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDeEIsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUk7WUFDckQsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUk7U0FDeEQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3ZDLE9BQU87U0FDVjtRQUVELE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVwRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUN4QixvQkFBb0IsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUk7WUFDdkMsb0JBQW9CLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQ3pELENBQUM7UUFDRixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFFMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDeEIsb0JBQW9CLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUMxRCxvQkFBb0IsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQzFELDBCQUEwQixFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDOUQsMEJBQTBCLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUNqRSxDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbEYsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQzNCLGdCQUFnQixFQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxDQUMvQyxDQUFDO1FBQ0YsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RyxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDM0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FDbkMsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQ3hCLDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJO1lBQ3RELDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJO1lBQ3RELHVDQUF1QyxFQUFFLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxJQUFJO1lBQ3ZFLHVDQUF1QyxFQUFFLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxJQUFJO1lBQ3ZFLHNDQUFzQyxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUk7WUFDdEUsc0NBQXNDLEVBQUUsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSTtTQUN6RSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDdkQsQ0FBQzs7O1lBMWJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFLFNBQVM7YUFDdEI7OztZQWhDRyxVQUFVO1lBSVYsU0FBUztZQURULE1BQU07eUNBc0ZELE1BQU0sU0FBQyxXQUFXOzs7a0JBdkR0QixLQUFLLFNBQUMsS0FBSyxjQUFHLFdBQVcsU0FBQyxVQUFVO3NCQUVwQyxLQUFLLFNBQUMsU0FBUzt1QkFFZixLQUFLLFNBQUMsY0FBYzttQkFFcEIsS0FBSyxTQUFDLGFBQWE7c0JBRW5CLEtBQUssU0FBQyxjQUFjO3VCQUVwQixLQUFLLFNBQUMsaUJBQWlCO29CQUV2QixLQUFLLFNBQUMsbUJBQW1COzZCQUV6QixLQUFLOzZCQUVMLEtBQUs7MkJBRUwsS0FBSyxTQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgTmdab25lLFxuICAgIFJlbmRlcmVyMixcbiAgICBPbkNoYW5nZXMsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBIb3N0QmluZGluZywgT25EZXN0cm95LCBQTEFURk9STV9JRFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFJlZFpvb21UZW1wbGF0ZSB9IGZyb20gJy4vcmVkLXpvb20tdGVtcGxhdGUuY2xhc3MnO1xuaW1wb3J0IHsgUmVkWm9vbVN0YXR1cyB9IGZyb20gJy4vcmVkLXpvb20tc3RhdHVzLnR5cGUnO1xuaW1wb3J0IHsgUmVkWm9vbUltYWdlIH0gZnJvbSAnLi9yZWQtem9vbS1pbWFnZS5jbGFzcyc7XG5pbXBvcnQgKiBhcyB2ZWN0b3IgZnJvbSAnLi92ZWN0b3InO1xuaW1wb3J0IHsgVmVjdG9yTnVtYmVyIH0gZnJvbSAnLi92ZWN0b3InO1xuXG5cbmludGVyZmFjZSBTZXNzaW9uIHtcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgdGh1bWJTaXplOiB2ZWN0b3IuVmVjdG9yTnVtYmVyO1xuICAgIHRodW1iUG9zOiB2ZWN0b3IuVmVjdG9yTnVtYmVyO1xuICAgIGxlbnNDb250YWluZXJTaXplOiB2ZWN0b3IuVmVjdG9yTnVtYmVyO1xuICAgIGxlbnNJbWFnZVNpemU6IHZlY3Rvci5WZWN0b3JOdW1iZXI7XG4gICAgZnJhbWVTaXplOiB2ZWN0b3IuVmVjdG9yTnVtYmVyO1xuICAgIG1vdXNlUG9zOiB2ZWN0b3IuVmVjdG9yTnVtYmVyO1xuICAgIGRlc3Ryb3k6ICgpID0+IHZvaWQ7XG59XG5cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcmVkWm9vbV0nLFxuICAgIGV4cG9ydEFzOiAncmVkWm9vbScsXG59KVxuZXhwb3J0IGNsYXNzIFJlZFpvb21EaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCdzcmMnKSBASG9zdEJpbmRpbmcoJ2F0dHIuc3JjJykgc3JjOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoJ3JlZFpvb20nKSBsZW5zU3JjOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoJ3JlZFpvb21UaHVtYicpIHRodW1iU3JjOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoJ3JlZFpvb21MYXp5JykgbGF6eTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCdyZWRab29tQ2xhc3MnKSBjbGFzc2VzOiBzdHJpbmcgPSAnJztcblxuICAgIEBJbnB1dCgncmVkWm9vbUJlaGF2aW9yJykgYmVoYXZpb3I6ICdob3ZlcicgfCAnZ3JhYicgfCAnY2xpY2snID0gJ2hvdmVyJztcblxuICAgIEBJbnB1dCgncmVkWm9vbU1vdXNlV2hlZWwnKSB3aGVlbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBtaW5TY2FsZUZhY3RvcjogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4U2NhbGVGYWN0b3I6IG51bWJlcjtcblxuICAgIEBJbnB1dCgncmVkWm9vbUVycm9yTWVzc2FnZScpIGVycm9yTWVzc2FnZTogc3RyaW5nID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGxvYWRpbmcgdGhlIGltYWdlLic7XG5cbiAgICB0ZW1wbGF0ZTogUmVkWm9vbVRlbXBsYXRlO1xuICAgIHRodW1iSW1hZ2U6IFJlZFpvb21JbWFnZTtcbiAgICBmcmFtZUltYWdlOiBSZWRab29tSW1hZ2U7XG4gICAgbGVuc0ltYWdlOiBSZWRab29tSW1hZ2U7XG4gICAgc2NhbGVGYWN0b3IgPSAxO1xuICAgIHNlc3Npb246IFNlc3Npb247XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQgPSBudWxsO1xuXG4gICAgZ2V0IGlzSW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC50YWdOYW1lID09PSAnSU1HJztcbiAgICB9XG5cbiAgICBnZXQgc3RhdHVzKCk6IFJlZFpvb21TdGF0dXMge1xuICAgICAgICBsZXQgc3RhdHVzOiBSZWRab29tU3RhdHVzID0gJ2xvYWRlZCc7XG4gICAgICAgIGNvbnN0IGltYWdlcyA9IFt0aGlzLmZyYW1lSW1hZ2UsIHRoaXMubGVuc0ltYWdlXTtcblxuICAgICAgICBpZiAodGhpcy5pc0ltYWdlKSB7XG4gICAgICAgICAgICBpbWFnZXMucHVzaCh0aGlzLnRodW1iSW1hZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaW1hZ2Ugb2YgaW1hZ2VzKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnZXJyb3InIHx8IGltYWdlLnN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdlcnJvcic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ2xvYWRpbmcnIHx8IGltYWdlLnN0YXR1cyA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ2xvYWRpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IHN0cmluZyxcbiAgICApIHsgfVxuXG4gICAgbGlzdGVuKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzdGFydEV2ZW50TmFtZSA9IHtcbiAgICAgICAgICAgICdob3Zlcic6ICdtb3VzZWVudGVyJyxcbiAgICAgICAgICAgICdncmFiJzogJ21vdXNlZG93bicsXG4gICAgICAgICAgICAnY2xpY2snOiAnbW91c2Vkb3duJyxcbiAgICAgICAgfVt0aGlzLmJlaGF2aW9yXTtcblxuICAgICAgICB0aGlzLnVubGlzdGVuKCk7XG4gICAgICAgIHRoaXMudW5saXN0ZW4gPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgc3RhcnRFdmVudE5hbWUsIHRoaXMubW91c2VFbnRlcik7XG4gICAgfVxuXG4gICAgdW5saXN0ZW46ICgpID0+IHZvaWQgID0gKCkgPT4ge307XG5cbiAgICBvbkltYWdlQ2hhbmdlU3RhdHVzID0gKCgpID0+IHtcbiAgICAgICAgbGV0IHByZXZpb3VzU3RhdHVzO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNTdGF0dXMgPT09IHRoaXMuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmV2aW91c1N0YXR1cyA9IHRoaXMuc3RhdHVzO1xuXG4gICAgICAgICAgICB0aGlzLm9uSW1hZ2VDaGFuZ2VTdGF0dXNEaXN0aW5jdCgpO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBvbkltYWdlQ2hhbmdlU3RhdHVzRGlzdGluY3QgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnbG9hZGVkJykge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zZXRQcm9wZXJ0aWVzKHtcbiAgICAgICAgICAgICAgICAnLS1yZWQtem9vbS1sZW5zLWltYWdlLW5hdHVyYWwtdyc6IGAke3RoaXMubGVuc0ltYWdlLm5hdHVyYWxXaWR0aH1weGAsXG4gICAgICAgICAgICAgICAgJy0tcmVkLXpvb20tbGVucy1pbWFnZS1uYXR1cmFsLWgnOiBgJHt0aGlzLmxlbnNJbWFnZS5uYXR1cmFsSGVpZ2h0fXB4YCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZXNzaW9uICYmIHRoaXMuc2Vzc2lvbi5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGNTY2FsZUZhY3RvcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY0ZyYW1lU2l6ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZUZhY3RvciA9IHRoaXMubGVuc0ltYWdlLndpZHRoIC8gdGhpcy5sZW5zSW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IG5ldyBSZWRab29tVGVtcGxhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUuY2xhc3NlcyA9IHRoaXMuY2xhc3NlcztcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUuZXJyb3JNZXNzYWdlLmlubmVySFRNTCA9IHRoaXMuZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHVtYkltYWdlID0gbmV3IFJlZFpvb21JbWFnZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgdGhpcy5vbkltYWdlQ2hhbmdlU3RhdHVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mcmFtZUltYWdlID0gbmV3IFJlZFpvb21JbWFnZShudWxsLCB0aGlzLm9uSW1hZ2VDaGFuZ2VTdGF0dXMsICdyZWQtem9vbV9fZnJhbWUtaW1hZ2UnKTtcbiAgICAgICAgICAgIHRoaXMubGVuc0ltYWdlID0gbmV3IFJlZFpvb21JbWFnZShudWxsLCB0aGlzLm9uSW1hZ2VDaGFuZ2VTdGF0dXMsICdyZWQtem9vbV9fbGVucy1pbWFnZScpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMubGF6eSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZEZyYW1lSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRMZW5zSW1hZ2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5saXN0ZW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnc3JjJyBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzLnNyYy5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZVRodW1iU3JjKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCd0aHVtYlNyYycgaW4gY2hhbmdlcyAmJiAhY2hhbmdlcy50aHVtYlNyYy5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZVRodW1iU3JjKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdsZW5zU3JjJyBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzLmxlbnNTcmMuZmlyc3RDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VMZW5zU3JjKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdiZWhhdmlvcicgaW4gY2hhbmdlcyAmJiAhY2hhbmdlcy5iZWhhdmlvci5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2NsYXNzZXMnIGluIGNoYW5nZXMgJiYgIWNoYW5nZXMuY2xhc3Nlcy5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZS5jbGFzc2VzID0gdGhpcy5jbGFzc2VzO1xuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdlcnJvck1lc3NhZ2UnIGluIGNoYW5nZXMgJiYgIWNoYW5nZXMuZXJyb3JNZXNzYWdlLmZpcnN0Q2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlLmVycm9yTWVzc2FnZS5pbm5lckhUTUwgPSB0aGlzLmVycm9yTWVzc2FnZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNoYW5nZVRodW1iU3JjKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZyYW1lSW1hZ2UucmVzZXQoKTtcblxuICAgICAgICBpZiAoIXRoaXMubGF6eSB8fCB0aGlzLnNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEZyYW1lSW1hZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2hhbmdlTGVuc1NyYygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sZW5zSW1hZ2UucmVzZXQoKTtcblxuICAgICAgICBpZiAoIXRoaXMubGF6eSB8fCB0aGlzLnNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9hZExlbnNJbWFnZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGh1bWJTcmMoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW1hZ2UgfHwgIXRoaXMuc3JjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50aHVtYlNyYztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNyYztcbiAgICB9XG5cbiAgICBsb2FkTGVuc0ltYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5sZW5zSW1hZ2Uuc3RhdHVzICE9PSAnbG9hZGVkJykge1xuICAgICAgICAgICAgdGhpcy5sZW5zSW1hZ2Uuc3JjID0gdGhpcy5sZW5zU3JjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEZyYW1lSW1hZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmZyYW1lSW1hZ2Uuc3RhdHVzICE9PSAnbG9hZGVkJykge1xuICAgICAgICAgICAgdGhpcy5mcmFtZUltYWdlLnNyYyA9IHRoaXMuZ2V0VGh1bWJTcmMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdXNlRW50ZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZXNzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXNzaW9uID0ge1xuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgIHRodW1iU2l6ZTogbnVsbCxcbiAgICAgICAgICAgIHRodW1iUG9zOiBudWxsLFxuICAgICAgICAgICAgbGVuc0NvbnRhaW5lclNpemU6IG51bGwsXG4gICAgICAgICAgICBsZW5zSW1hZ2VTaXplOiBudWxsLFxuICAgICAgICAgICAgZnJhbWVTaXplOiBudWxsLFxuICAgICAgICAgICAgbW91c2VQb3M6IHZlY3Rvci5mcm9tTW91c2VFdmVudChldmVudCksXG4gICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7fSxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbldoZWVsID0gKHdoZWVsRXZlbnQ6IFdoZWVsRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghd2hlZWxFdmVudC5jYW5jZWxhYmxlIHx8IHRoaXMuc3RhdHVzICE9PSAnbG9hZGVkJyB8fCAhdGhpcy53aGVlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hlZWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IE1hdGguc2lnbih3aGVlbEV2ZW50LmRlbHRhWSk7XG4gICAgICAgICAgICBjb25zdCBuZXh0U2NhbGVGYWN0b3IgPSB0aGlzLnNjYWxlRmFjdG9yICsgLjAxICogLWRlbHRhO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuZXh0U2NhbGVGYWN0b3IpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5taW5TY2FsZUZhY3RvciAhPT0gdW5kZWZpbmVkICYmIG5leHRTY2FsZUZhY3RvciA8IHRoaXMubWluU2NhbGVGYWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhTY2FsZUZhY3RvciAhPT0gdW5kZWZpbmVkICYmIG5leHRTY2FsZUZhY3RvciA+IHRoaXMubWF4U2NhbGVGYWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2NhbGVGYWN0b3IgKz0gLjAxICogLWRlbHRhO1xuXG4gICAgICAgICAgICB0aGlzLmNhbGNTY2FsZUZhY3RvcigpO1xuICAgICAgICAgICAgdGhpcy5jYWxjRnJhbWVTaXplKCk7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKFxuICAgICAgICAgICAgICAgIHRoaXMuYmVoYXZpb3IgPT09ICdjbGljaycgPyB0aGlzLnNlc3Npb24ubW91c2VQb3MgOiB2ZWN0b3IuZnJvbU1vdXNlRXZlbnQod2hlZWxFdmVudCksXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uTW92ZSA9IChtb3VzZUV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKHZlY3Rvci5mcm9tTW91c2VFdmVudChtb3VzZUV2ZW50KSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9uTGVhdmUgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZS5kZXRhY2goKTtcblxuICAgICAgICAgICAgdW5MaXN0ZW5Nb3ZlKCk7XG4gICAgICAgICAgICB1bkxpc3RlbkxlYXZlKCk7XG4gICAgICAgICAgICB1bkxpc3RlbldoZWVsKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHVuTGlzdGVuTW92ZTtcbiAgICAgICAgbGV0IHVuTGlzdGVuTGVhdmU7XG4gICAgICAgIGxldCB1bkxpc3RlbldoZWVsO1xuXG4gICAgICAgIGlmICh0aGlzLmJlaGF2aW9yID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICB1bkxpc3Rlbk1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlbW92ZScsIG9uTW92ZSk7XG4gICAgICAgICAgICB1bkxpc3RlbkxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZWxlYXZlJywgb25MZWF2ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5iZWhhdmlvciA9PT0gJ2NsaWNrJykge1xuICAgICAgICAgICAgdW5MaXN0ZW5Nb3ZlID0gKCkgPT4ge307XG4gICAgICAgICAgICB1bkxpc3RlbkxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdtb3VzZWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBvbkxlYXZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bkxpc3Rlbk1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudCwgJ21vdXNlbW92ZScsIG9uTW92ZSk7XG4gICAgICAgICAgICB1bkxpc3RlbkxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdtb3VzZXVwJywgb25MZWF2ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB1bkxpc3RlbldoZWVsID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd3aGVlbCcsIG9uV2hlZWwpO1xuXG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUodmVjdG9yLmZyb21Nb3VzZUV2ZW50KGV2ZW50KSk7XG5cbiAgICAgICAgdGhpcy5mb3JjZVJlZmxvdygpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlLmFjdGl2YXRlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzICE9PSAnbG9hZGVkJykge1xuICAgICAgICAgICAgdGhpcy5sb2FkTGVuc0ltYWdlKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcmFtZUltYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlc3Npb24uZGVzdHJveSA9IG9uTGVhdmU7XG4gICAgfTtcblxuICAgIG9uTW91c2VNb3ZlID0gKG1vdXNlUG9zOiBWZWN0b3JOdW1iZXIpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbWFnZSAmJiB0aGlzLnRodW1iSW1hZ2Uuc3RhdHVzICE9PSAnbG9hZGVkJyAmJiB0aGlzLnRodW1iSW1hZ2UuaXNGaXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNlc3Npb24uYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnNlc3Npb24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Vzc2lvbi5tb3VzZVBvcyA9IG1vdXNlUG9zO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2xvYWRlZCcpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lSWQpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMubW92ZSgpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpbml0U2Vzc2lvbigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdGh1bWJSZWN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgdGhpcy5zZXNzaW9uLnRodW1iU2l6ZSA9IHZlY3Rvci5mcm9tUmVjdFNpemUodGh1bWJSZWN0KTtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnRodW1iUG9zID0gdmVjdG9yLmFkZCh2ZWN0b3IuZnJvbVJlY3RQb3ModGh1bWJSZWN0KSwgdmVjdG9yLmZyb21TY3JvbGwoKSk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5hdHRhY2goKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5sZW5zQm9keS5hcHBlbmRDaGlsZCh0aGlzLmxlbnNJbWFnZS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5mcmFtZUJvZHkuYXBwZW5kQ2hpbGQodGhpcy5mcmFtZUltYWdlLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGUuc2V0UHJvcGVydGllcyh7XG4gICAgICAgICAgICAnLS1yZWQtem9vbS10aHVtYi14JzogYCR7dGhpcy5zZXNzaW9uLnRodW1iUG9zLnh9cHhgLFxuICAgICAgICAgICAgJy0tcmVkLXpvb20tdGh1bWIteSc6IGAke3RoaXMuc2Vzc2lvbi50aHVtYlBvcy55fXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLXRodW1iLXcnOiBgJHt0aGlzLnNlc3Npb24udGh1bWJTaXplLnh9cHhgLFxuICAgICAgICAgICAgJy0tcmVkLXpvb20tdGh1bWItaCc6IGAke3RoaXMuc2Vzc2lvbi50aHVtYlNpemUueX1weGAsXG4gICAgICAgICAgICAnLS1yZWQtem9vbS10aHVtYi1zaXplLW1heCc6IGAke3ZlY3Rvci5mbGF0TWF4KHRoaXMuc2Vzc2lvbi50aHVtYlNpemUpfXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLXRodW1iLXNpemUtbWluJzogYCR7dmVjdG9yLmZsYXRNaW4odGhpcy5zZXNzaW9uLnRodW1iU2l6ZSl9cHhgLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdsb2FkZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGNTY2FsZUZhY3RvcigpO1xuICAgICAgICAgICAgdGhpcy5jYWxjRnJhbWVTaXplKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2NhbGVGYWN0b3IgPSB0aGlzLmxlbnNJbWFnZS53aWR0aCAvIHRoaXMubGVuc0ltYWdlLm5hdHVyYWxXaWR0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNTY2FsZUZhY3RvcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2NhbGVkU2l6ZSA9IHZlY3Rvci5tdWwodGhpcy5sZW5zSW1hZ2UubmF0dXJhbFNpemUsIHRoaXMuc2NhbGVGYWN0b3IpO1xuXG4gICAgICAgIHRoaXMubGVuc0ltYWdlLnN0eWxlU2l6ZSA9IHZlY3Rvci5tYXAoc2NhbGVkU2l6ZSwgYyA9PiBgJHtjfXB4YCk7XG5cbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3JJc0xpbWl0ZWQgPSB2ZWN0b3IuZmxhdE9yKFxuICAgICAgICAgICAgdmVjdG9yLm5vdEVxdWFsKHRoaXMubGVuc0ltYWdlLnNpemUsIHZlY3Rvci5yb3VuZChzY2FsZWRTaXplKSlcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoc2NhbGVGYWN0b3JJc0xpbWl0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2NhbGVGYWN0b3IgPSB2ZWN0b3IuZmxhdE1heCh2ZWN0b3IuZGl2KHRoaXMubGVuc0ltYWdlLnNpemUsIHRoaXMubGVuc0ltYWdlLm5hdHVyYWxTaXplKSk7XG5cbiAgICAgICAgICAgIHRoaXMubGVuc0ltYWdlLnN0eWxlU2l6ZSA9IHZlY3Rvci5tYXAodmVjdG9yLm11bCh0aGlzLmxlbnNJbWFnZS5uYXR1cmFsU2l6ZSwgdGhpcy5zY2FsZUZhY3RvciksIGMgPT4gYCR7Y31weGApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY0ZyYW1lU2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLmxlbnNDb250YWluZXJTaXplID0gdmVjdG9yLmZyb21SZWN0U2l6ZSh0aGlzLnRlbXBsYXRlLmxlbnNCb2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uLmxlbnNJbWFnZVNpemUgPSB2ZWN0b3IuZnJvbVJlY3RTaXplKHRoaXMubGVuc0ltYWdlLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuXG4gICAgICAgIHRoaXMuc2Vzc2lvbi5mcmFtZVNpemUgPSB2ZWN0b3IubWluKFxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uLnRodW1iU2l6ZSxcbiAgICAgICAgICAgIHZlY3Rvci5yb3VuZChcbiAgICAgICAgICAgICAgICB2ZWN0b3IubXVsKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb24udGh1bWJTaXplLCB2ZWN0b3IuZGl2KHRoaXMuc2Vzc2lvbi5sZW5zQ29udGFpbmVyU2l6ZSwgdGhpcy5zZXNzaW9uLmxlbnNJbWFnZVNpemUpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGUuc2V0UHJvcGVydGllcyh7XG4gICAgICAgICAgICAnLS1yZWQtem9vbS1mcmFtZS13JzogYCR7dGhpcy5zZXNzaW9uLmZyYW1lU2l6ZS54fXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLWZyYW1lLWgnOiBgJHt0aGlzLnNlc3Npb24uZnJhbWVTaXplLnl9cHhgLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtb3ZlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc2Vzc2lvbiB8fCAhdGhpcy5zZXNzaW9uLmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBtb3VzZVBvcywgdGh1bWJTaXplLCB0aHVtYlBvcywgZnJhbWVTaXplLCBsZW5zQ29udGFpbmVyU2l6ZSwgbGVuc0ltYWdlU2l6ZSB9ID0gdGhpcy5zZXNzaW9uO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGUuc2V0UHJvcGVydGllcyh7XG4gICAgICAgICAgICAnLS1yZWQtem9vbS1tb3VzZS14JzogYCR7bW91c2VQb3MueH1weGAsXG4gICAgICAgICAgICAnLS1yZWQtem9vbS1tb3VzZS15JzogYCR7bW91c2VQb3MueX1weGAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGZyYW1lUG9zID0gdmVjdG9yLnN1Yihtb3VzZVBvcywgdmVjdG9yLmRpdihmcmFtZVNpemUsIDIpKTtcbiAgICAgICAgY29uc3QgZnJhbWVMaW1pdGVkUG9zID0gdmVjdG9yLm1pbihcbiAgICAgICAgICAgIHZlY3Rvci5tYXgoZnJhbWVQb3MsIHRodW1iUG9zKSxcbiAgICAgICAgICAgIHZlY3Rvci5zdWIodmVjdG9yLmFkZCh0aHVtYlBvcywgdGh1bWJTaXplKSwgZnJhbWVTaXplKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZnJhbWVJbWFnZVBvcyA9IHZlY3Rvci5zdWIodGh1bWJQb3MsIHZlY3Rvci5yb3VuZChmcmFtZUxpbWl0ZWRQb3MpKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlLnNldFByb3BlcnRpZXMoe1xuICAgICAgICAgICAgJy0tcmVkLXpvb20tZnJhbWUteCc6IGAke01hdGgucm91bmQoZnJhbWVMaW1pdGVkUG9zLngpfXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLWZyYW1lLXknOiBgJHtNYXRoLnJvdW5kKGZyYW1lTGltaXRlZFBvcy55KX1weGAsXG4gICAgICAgICAgICAnLS1yZWQtem9vbS1mcmFtZS1pbWFnZS14JzogYCR7TWF0aC5yb3VuZChmcmFtZUltYWdlUG9zLngpfXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLWZyYW1lLWltYWdlLXknOiBgJHtNYXRoLnJvdW5kKGZyYW1lSW1hZ2VQb3MueSl9cHhgLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBmcmFtZVJlbGF0aXZlUG9zID0gdmVjdG9yLm1hcCh2ZWN0b3Iuc3ViKHRodW1iU2l6ZSwgZnJhbWVTaXplKSwgKHZhbHVlLCBheGlzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IDAgPyAwIDogKGZyYW1lTGltaXRlZFBvc1theGlzXSAtIHRodW1iUG9zW2F4aXNdKSAvIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbGVuc0ltYWdlUG9zID0gdmVjdG9yLm11bChcbiAgICAgICAgICAgIGZyYW1lUmVsYXRpdmVQb3MsXG4gICAgICAgICAgICB2ZWN0b3Iuc3ViKGxlbnNJbWFnZVNpemUsIGxlbnNDb250YWluZXJTaXplKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBsZW5zSW1hZ2VDZW50ZXJPZmZzZXQgPSB2ZWN0b3IubWF4KHZlY3Rvci5kaXYodmVjdG9yLnN1YihsZW5zQ29udGFpbmVyU2l6ZSwgbGVuc0ltYWdlU2l6ZSksIDIpLCAwKTtcbiAgICAgICAgY29uc3QgbGVuc0ltYWdlRnJhbWVPZmZzZXQgPSB2ZWN0b3IubXVsKFxuICAgICAgICAgICAgdmVjdG9yLmRpdih2ZWN0b3Iuc3ViKGZyYW1lUG9zLCBmcmFtZUxpbWl0ZWRQb3MpLCB2ZWN0b3IuZGl2KGZyYW1lU2l6ZSwgMikpLFxuICAgICAgICAgICAgdmVjdG9yLmRpdihsZW5zQ29udGFpbmVyU2l6ZSwgMilcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlLnNldFByb3BlcnRpZXMoe1xuICAgICAgICAgICAgJy0tcmVkLXpvb20tbGVucy1pbWFnZS1iYXNlLXgnOiBgJHstbGVuc0ltYWdlUG9zLnh9cHhgLFxuICAgICAgICAgICAgJy0tcmVkLXpvb20tbGVucy1pbWFnZS1iYXNlLXknOiBgJHstbGVuc0ltYWdlUG9zLnl9cHhgLFxuICAgICAgICAgICAgJy0tcmVkLXpvb20tbGVucy1pbWFnZS1jZW50ZXItb2Zmc2V0LXgnOiBgJHtsZW5zSW1hZ2VDZW50ZXJPZmZzZXQueH1weGAsXG4gICAgICAgICAgICAnLS1yZWQtem9vbS1sZW5zLWltYWdlLWNlbnRlci1vZmZzZXQteSc6IGAke2xlbnNJbWFnZUNlbnRlck9mZnNldC55fXB4YCxcbiAgICAgICAgICAgICctLXJlZC16b29tLWxlbnMtaW1hZ2UtZnJhbWUtb2Zmc2V0LXgnOiBgJHstbGVuc0ltYWdlRnJhbWVPZmZzZXQueH1weGAsXG4gICAgICAgICAgICAnLS1yZWQtem9vbS1sZW5zLWltYWdlLWZyYW1lLW9mZnNldC15JzogYCR7LWxlbnNJbWFnZUZyYW1lT2Zmc2V0Lnl9cHhgLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5zZXNzaW9uICYmIHRoaXMuc2Vzc2lvbi5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlc3Npb24oKTtcbiAgICAgICAgICAgIHRoaXMubW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yY2VSZWZsb3coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIH1cbn1cbiJdfQ==