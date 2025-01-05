export interface IEvents {
    clickEvents: IClickEvent[];
    scrollEvents: IScrollEvent[];
    mousemoveEvents: IMousemoveEvent[];
}

export interface IClickEvent {
    x: number;
    y: number;
    timestamp: number;
}

export interface IScrollEvent {
    scrollY: number;
    timestamp: number;
}

export interface IMousemoveEvent {
    x: number;
    y: number;
    timestamp: number;
}
