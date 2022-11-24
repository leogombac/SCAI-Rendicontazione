import { Component, OnInit } from '@angular/core';
import { combineLatest, share, switchMap } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chiusura-mensile',
  templateUrl: './chiusura-mensile.component.html',
  styleUrls: ['./chiusura-mensile.component.css']
})
export class ChiusuraMensileComponent implements OnInit {

  chiusuraMese$;

  constructor(
    private appState: AppStateService,
    public userService: UserService,
    public chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {
    this.chiusuraMese$ = 
      combineLatest([
        this.appState.viewDate$,
        this.chiusureService.refresh$
      ])
      .pipe(
        switchMap(_ =>
          this.chiusureService.getChiusuraMese$()
        ),
        share()
      )
  }

}
