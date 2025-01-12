import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'consuntivi',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'consuntivi',
            loadChildren: () => import('./consuntivi/consuntivi.module').then(m => m.ConsuntiviModule)
        }],
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'chiusura-mensile',
            loadChildren: () => import('./chiusura-mensile/chiusura-mensile.module').then(m => m.ChiusuraMensileModule)
        }],
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'chiusure-referente',
            loadChildren: () => import('./chiusure-referente/chiusure-referente.module').then(m => m.ChiusureReferenteModule)
        }],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'pages',
                loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'pages/not-found'
    }
];
