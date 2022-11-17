import { Location } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { first } from 'rxjs';
import { addHours } from 'date-fns';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ToasterService } from 'src/app/shared/toaster/toaster.service';
import { ToastLevel } from 'src/app/models/toast';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    constructor(
        private element: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private toasterService: ToasterService
    ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }

    async login(username) {
        console.warn(username);
        try {
            await this.authService.login(username);
            this.toasterService.addToast(ToastLevel.Success, "Login effettuato con successo!");
            this.router.navigate(['/']);
        }
        catch(e) {
            this.toasterService.addToast(ToastLevel.Danger, "Qualcosa è andato storto durante il login.");
        }
    }

}
