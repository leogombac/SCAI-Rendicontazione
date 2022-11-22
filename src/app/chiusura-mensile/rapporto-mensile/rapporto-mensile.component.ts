import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rapporto-mensile',
  templateUrl: './rapporto-mensile.component.html',
  styleUrls: ['./rapporto-mensile.component.css']
})
export class RapportoMensileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeDatePicker(eventData: any, dp?: any) {
    dp.close();
  }

}
