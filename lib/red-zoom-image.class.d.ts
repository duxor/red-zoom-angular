import { RedZoomStatus } from './red-zoom-status.type';
import * as vector from './vector';
export declare class RedZoomImage {
    element: HTMLImageElement;
    listener: () => void;
    private loading;
    isFirst: boolean;
    get width(): number;
    get height(): number;
    get size(): vector.VectorNumber;
    get naturalWidth(): number;
    get naturalHeight(): number;
    get naturalSize(): vector.VectorNumber;
    get style(): CSSStyleDeclaration;
    set styleSize(value: vector.VectorString);
    get status(): RedZoomStatus;
    set src(value: string);
    constructor(element?: HTMLImageElement, listener?: () => void, className?: string);
    reset(): void;
    destroy: () => void;
}
