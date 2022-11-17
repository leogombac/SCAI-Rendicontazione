import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LoginService } from '../api/services';
import { LoginData } from '../models/auth';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';

const LOGIN_LS = 'LOGIN_DATA'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loginData$ = new BehaviorSubject<LoginData>(null);
  loginData$ = this._loginData$.asObservable();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toasterService: ToasterService
  ) {
    this.login(); // Auto-login
  }

  login(username?) {

    // Call to the login at backend
    const login = async () => {
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

    // If user is already logged in...
    if (this.isLoggedIn()) {
      const loginData = this.getLoginData();

      // ...but with a different account, then make a new login
      if (username && username !== loginData.username)
        return login();

      // Else take the old login
      return this._loginData$.next(loginData);
    }

    // If it's auto-login but no login data is present, then launch a toast and route to login page
    if (!username) {
      this.toasterService.addToast(ToastLevel.Warning, `Effettua l'accesso per poter accedere all'applicativo.`);
      this.router.navigate(['pages', 'login']);
      return;
    }

    // If the user just submitted the login page form, then login
    login();
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
