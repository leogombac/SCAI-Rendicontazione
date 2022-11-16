export enum ToastLevel {
    Danger = 'danger',
    Warning = 'warning',
    Success = 'success',
    Info = 'info',
}

export enum ToastDuration {
    Short = 2000,
    Medium = 3000,
    Long = 5000,
}

export interface Toast {
    level: ToastLevel;
    message: string;
    autohide: boolean;
    duration: ToastDuration;
}