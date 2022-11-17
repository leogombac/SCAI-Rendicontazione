import { Routes } from '@angular/router';

import { HomepageComponent } from './homepage.component';

export const HomepageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomepageComponent
      }
    ]
  }
];
