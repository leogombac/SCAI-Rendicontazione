import { Component, OnInit } from '@angular/core';
import { RendicontazioneService } from 'src/app/services/rendicontazione.service';

@Component({
  selector: 'app-refreshing-header',
  templateUrl: './refreshing-header.component.html',
})
export class RefreshingHeaderComponent implements OnInit {

  constructor(
    public rendicontazioneService: RendicontazioneService
  ) { }

  ngOnInit(): void {
  }

}
