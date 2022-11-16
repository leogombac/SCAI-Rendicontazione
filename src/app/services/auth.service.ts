import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LoginService } from '../api/services';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';

const LOGIN_LS = 'LOGIN_DATA'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loginData$ = new BehaviorSubject<any>(null);
  loginData$ = this._loginData$.asObservable();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toasterService: ToasterService
  ) {
    this.login(); // Auto-login
  }

  async login(username?) {

    if (this.isLoggedIn()) {
      this._loginData$.next(this.getLoginData());
      return;
    }

    if (!username) {
      this.toasterService.addToast(ToastLevel.Warning, `Effettua l'accesso per poter accedere all'applicativo.`);
      this.router.navigate(['pages', 'login']);
      return;
    }

    const response = await lastValueFrom(
      this.loginService.consuntivazioneLoginPost$Json({
        context: new HttpContext(),
        body: { user: username, token: 'empty' }
      })
    );
    response['username'] = username;
    localStorage.setItem(LOGIN_LS, JSON.stringify(response));
    this._loginData$.next(this.getLoginData());
  }

  logout() {
    localStorage.removeItem(LOGIN_LS);
    this.router.navigate(['pages', 'login']);
    this._loginData$.next(null);
  }

  isLoggedIn() {
    const loginData = this.getLoginData();
    if (loginData && loginData.expire && new Date(loginData.expire).getTime() < new Date().getTime())
      return false;
    return !!loginData;
  }

  getLoginData() {
    return JSON.parse(localStorage.getItem(LOGIN_LS));
  }

  getBearer() {
    if (!this.getLoginData())
      return null;
    return this.getLoginData().token;
  }
}
