import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { DialogComponent } from './dialog.component';

declare const $: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {

  ToastLevel = ToastLevel;
  
  constructor(
    private toasterService: ToasterService,
    public dialog: MatDialog
  ) { }

  launchToast(level: ToastLevel) {
    console.log(this.toasterService);
    this.toasterService.addToast(level, "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias architecto, consectetur enim possimus facilis at.");
  }

  launchDialog() {
    this.dialog.open(DialogComponent, { width: '250px', enterAnimationDuration: '0ms', exitAnimationDuration: '0ms'});
  }

}
