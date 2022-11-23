import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';
import { ConsuntivoService } from 'src/app/services/consuntivo.service';

@Component({
  selector: 'app-refreshing-header',
  templateUrl: './refreshing-header.component.html',
})
export class RefreshingHeaderComponent implements OnInit {

  constructor(
    public appState: AppStateService,
    public consuntivoService: ConsuntivoService
  ) { }

  ngOnInit(): void {
  }

}
