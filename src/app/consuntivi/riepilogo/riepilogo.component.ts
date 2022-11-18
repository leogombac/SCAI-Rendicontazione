import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConsuntivoEvent } from 'src/app/models/rendicontazione';
import { RendicontazioneService } from 'src/app/services/rendicontazione.service';
import { DialogGestionePresenzaComponent } from '../../dialog-gestione-presenza/dialog-gestione-presenza.component';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.css']
})
export class RiepilogoComponent implements OnInit {

  constructor(
    public rendicontazioneService: RendicontazioneService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openDialog(consuntivo: ConsuntivoEvent) {
    this.dialog.open(
      DialogGestionePresenzaComponent,
      {
        data: consuntivo,
        width: '90%',
        maxWidth: '800px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms'
      }
    );
  }

}
