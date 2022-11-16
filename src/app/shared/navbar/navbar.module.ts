import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
    imports: [ RouterModule, CommonModule, MatAutocompleteModule],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
