import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  template: '<p>Nothing to see here!</p>'
})
export class DialogComponent {

  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

}
