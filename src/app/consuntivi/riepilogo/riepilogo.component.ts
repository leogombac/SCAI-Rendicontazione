import { Component, OnInit } from '@angular/core';
import { RendicontazioneService } from 'src/app/services/rendicontazione.service';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.css']
})
export class RiepilogoComponent implements OnInit {

  constructor(
    public rendicontazioneService: RendicontazioneService
  ) { }

  ngOnInit(): void {
  }

}
