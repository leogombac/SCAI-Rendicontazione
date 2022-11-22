import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stato-utenti',
  templateUrl: './stato-utenti.component.html',
  styleUrls: ['./stato-utenti.component.css']
})
export class StatoUtentiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeDatePicker(eventData: any, dp?: any) {
    dp.close();
  }

}
