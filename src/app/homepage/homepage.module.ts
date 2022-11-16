import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { HomepageComponent } from './homepage.component';
import { HomepageRoutes } from './homepage.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomepageRoutes),
        FormsModule,
        MaterialModule
    ],
    declarations: [HomepageComponent]
})

export class HomepageModule {}
