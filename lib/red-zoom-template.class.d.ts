import { RedZoomStatus } from './red-zoom-status.type';
export declare class RedZoomTemplate {
    _status: RedZoomStatus;
    template: HTMLDivElement;
    lens: HTMLDivElement;
    lensBody: HTMLDivElement;
    frame: HTMLDivElement;
    frameBody: HTMLDivElement;
    error: HTMLDivElement;
    errorMessage: HTMLDivElement;
    private appliedClasses;
    constructor();
    set status(state: RedZoomStatus);
    get status(): RedZoomStatus;
    set classes(classes: string);
    get isHidden(): boolean;
    setProperties(properties: {
        [name: string]: string;
    }): void;
    detach(): void;
    attach(): void;
    activate(): void;
    onTransitionEnd: (event: TransitionEvent) => void;
}
