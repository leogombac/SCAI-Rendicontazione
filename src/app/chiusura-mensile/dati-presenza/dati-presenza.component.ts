import { Component, OnInit } from '@angular/core';
import { ChiusureService } from 'src/app/services/chiusure.service';

@Component({
  selector: 'app-dati-presenza',
  templateUrl: './dati-presenza.component.html',
  styleUrls: ['./dati-presenza.component.css']
})
export class DatiPresenzaComponent implements OnInit {

  constructor(
    private chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {
    this.chiusureService.getChiusuraMese$()
      .subscribe(console.warn);
  }

}
