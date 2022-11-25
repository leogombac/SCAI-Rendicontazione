import { Component, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dati-presenza',
  templateUrl: './dati-presenza.component.html',
  styleUrls: ['./dati-presenza.component.css']
})
export class DatiPresenzaComponent implements OnInit {

  chiusureMeseForTable$;

  @Input('chiusuraMese$') chiusuraMese$;

  constructor(
    private userService: UserService,
    public chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {
    let totMinuti;
    this.chiusureMeseForTable$ = this.chiusuraMese$
      .pipe(
        tap((chiusuraMese: any) => {
          totMinuti = 0;
          const [hh, mm] = chiusuraMese.totaleOre.split(':');
          totMinuti += hh * 60 + mm * 1;
        }),
        map((chiusuraMese: any) => chiusuraMese.presenzeGroupedByAttivita),
        map(presenzeGroupedByAttivita =>
          Object.values(presenzeGroupedByAttivita)
            .map(presenzeGroup => {
              const r = {
                row: null,
                subrows: null
              };
              r.row = presenzeGroup.reduce(
                (a, b) => {
                  a.idAttivita = b.idAttivita;
                  a.codiceAttivita = b.codiceAttivita;
                  a.numeroMinuti += b.numeroMinuti;
                  a.turni = a.turni || b.turni;
                  a.reperibilita = a.reperibilita || a.turni;
                  return a;
                },
                { numeroMinuti: 0, turni: false, reperibilita: false }
              );
              r.subrows = presenzeGroup
                .map(presenza =>
                  ({
                    ...presenza,
                    modalitaLavoro: this.userService.modalitaLavoro
                      .find(modalitaLavoro => modalitaLavoro.id === presenza.idTipoModalitaLavoro)
                      ?.descrizione
                  })
                );
              r.row._percent = (100 * r.row.numeroMinuti / totMinuti) + '%';
              return r;
            })
        )
      );
  }

}
