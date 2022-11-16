import { Injectable } from '@angular/core';
import { Toast, ToastDuration, ToastLevel } from '../../models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  toasts: Toast[] = [];

  constructor() { }

  addToast(level: ToastLevel, message: string, autohide = true, duration: ToastDuration = ToastDuration.Medium) {
    const newToast: Toast = { level, message, autohide, duration };
    this.toasts.push(newToast);
    if (autohide)
      setTimeout(() => this.removeToast(newToast), duration);
  }

  private removeToast(toast: Toast) {
    const spliceIndex = this.toasts.findIndex(t => t === toast);
    if (spliceIndex > -1)
      this.toasts.splice(spliceIndex, 1);
  }
}
