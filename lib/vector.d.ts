declare type Operator = '+' | '-' | '*' | '/' | 'min' | 'max';
export interface Vector<T> {
    x: T;
    y: T;
}
export declare type VectorNumber = Vector<number>;
export declare type VectorString = Vector<string>;
export declare type VectorBoolean = Vector<boolean>;
export declare function fromRectPos(rect: ClientRect): VectorNumber;
export declare function fromRectSize(rect: ClientRect): VectorNumber;
export declare function fromScroll(): VectorNumber;
export declare function fromMouseEvent(event: MouseEvent): VectorNumber;
export declare function op(a: VectorNumber, op: Operator, b: VectorNumber | number): VectorNumber;
export declare function add(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function sub(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function mul(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function div(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function min(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function max(a: VectorNumber, b: VectorNumber | number): VectorNumber;
export declare function round(a: VectorNumber): VectorNumber;
export declare function map<T, B>(a: Vector<T>, fn: (c: T, axis: 'x' | 'y') => B): Vector<B>;
export declare function equal(a: VectorNumber, b: VectorNumber | number): VectorBoolean;
export declare function notEqual(a: VectorNumber, b: VectorNumber): VectorBoolean;
export declare function flatMax(a: VectorNumber): number;
export declare function flatMin(a: VectorNumber): number;
export declare function flatOr(a: VectorBoolean): boolean;
export {};
