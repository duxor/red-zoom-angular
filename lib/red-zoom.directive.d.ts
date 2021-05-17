import { AfterContentInit, ElementRef, NgZone, Renderer2, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { RedZoomTemplate } from './red-zoom-template.class';
import { RedZoomStatus } from './red-zoom-status.type';
import { RedZoomImage } from './red-zoom-image.class';
import * as vector from './vector';
import * as ɵngcc0 from '@angular/core';
interface Session {
    active: boolean;
    thumbSize: vector.VectorNumber;
    thumbPos: vector.VectorNumber;
    lensContainerSize: vector.VectorNumber;
    lensImageSize: vector.VectorNumber;
    frameSize: vector.VectorNumber;
    mousePos: vector.VectorNumber;
    destroy: () => void;
}
export declare class RedZoomDirective implements AfterContentInit, OnChanges, OnDestroy {
    private element;
    private renderer;
    private zone;
    private platformId;
    src: string;
    lensSrc: string;
    thumbSrc: string;
    lazy: boolean;
    classes: string;
    behavior: 'hover' | 'grab' | 'click';
    wheel: boolean;
    minScaleFactor: number;
    maxScaleFactor: number;
    errorMessage: string;
    template: RedZoomTemplate;
    thumbImage: RedZoomImage;
    frameImage: RedZoomImage;
    lensImage: RedZoomImage;
    scaleFactor: number;
    session: Session;
    requestAnimationFrameId: any;
    get isImage(): boolean;
    get status(): RedZoomStatus;
    constructor(element: ElementRef, renderer: Renderer2, zone: NgZone, platformId: string);
    listen(): void;
    unlisten: () => void;
    onImageChangeStatus: () => void;
    onImageChangeStatusDistinct: () => void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    onChangeThumbSrc(): void;
    onChangeLensSrc(): void;
    getThumbSrc(): string;
    loadLensImage(): void;
    loadFrameImage(): void;
    mouseEnter: (event: MouseEvent) => void;
    onMouseMove: (mousePos: vector.VectorNumber) => void;
    initSession(): void;
    calcScaleFactor(): void;
    calcFrameSize(): void;
    move(): void;
    invalidate(): void;
    forceReflow(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<RedZoomDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<RedZoomDirective, "[redZoom]", ["redZoom"], { "lazy": "redZoomLazy"; "classes": "redZoomClass"; "behavior": "redZoomBehavior"; "wheel": "redZoomMouseWheel"; "errorMessage": "redZoomErrorMessage"; "src": "src"; "lensSrc": "redZoom"; "thumbSrc": "redZoomThumb"; "minScaleFactor": "minScaleFactor"; "maxScaleFactor": "maxScaleFactor"; }, {}, never>;
}
export {};

//# sourceMappingURL=red-zoom.directive.d.ts.map