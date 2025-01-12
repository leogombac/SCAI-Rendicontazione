import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AppStateService } from '../services/app-state.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/consuntivi',
        title: 'Consuntivi',
        type: 'link',
        icontype: 'edit_calendar'
    },
    {
        path: '/chiusura-mensile',
        title: 'Chiusura Mensile',
        type: 'link',
        icontype: 'free_cancellation'
    },
    {
        path: '/chiusure-referente',
        title: 'Chiusure Referente',
        type: 'link',
        icontype: 'view_list'
    },
    {
        path: 'pages/login',
        title: 'Login',
        type: 'link',
        icontype: 'login',
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;

    constructor(
        private authService: AuthService,
        public appState: AppStateService,
        public userService: UserService
    ) { }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }

    }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    logout() {
        this.authService.logout();
    }
}
