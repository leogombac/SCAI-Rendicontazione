import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsuntivoEvent } from 'src/app/models/rendicontazione';

@Component({
  selector: 'app-dialog-gestione-presenza',
  templateUrl: './dialog-gestione-presenza.component.html',
  styleUrls: ['./dialog-gestione-presenza.component.css']
})
export class DialogGestionePresenzaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConsuntivoEvent
  ) { }

  ngOnInit(): void {
  }

}
