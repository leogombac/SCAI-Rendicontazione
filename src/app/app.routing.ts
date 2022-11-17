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
            path: 'homepage',
            loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule)
        }],
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
