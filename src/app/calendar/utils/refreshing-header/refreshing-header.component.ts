import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';
import { ConsuntivoService } from 'src/app/services/consuntivo.service';
import { XlsxService } from 'src/app/services/xlsx.service';

@Component({
  selector: 'app-refreshing-header',
  templateUrl: './refreshing-header.component.html',
})
export class RefreshingHeaderComponent implements OnInit {

  constructor(
    public appState: AppStateService,
    public consuntivoService: ConsuntivoService,
    public xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
  }

}
