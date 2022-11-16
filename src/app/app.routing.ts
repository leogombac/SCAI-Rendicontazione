import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'homepage',
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
