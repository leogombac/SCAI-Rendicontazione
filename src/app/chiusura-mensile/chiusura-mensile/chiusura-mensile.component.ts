import { Component, OnInit } from '@angular/core';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { ConsuntivoService } from 'src/app/services/consuntivo.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chiusura-mensile',
  templateUrl: './chiusura-mensile.component.html',
  styleUrls: ['./chiusura-mensile.component.css']
})
export class ChiusuraMensileComponent implements OnInit {

  constructor(
    public userService: UserService,
    public chiusureService: ChiusureService,
    private consuntivoService: ConsuntivoService
  ) { }

  ngOnInit(): void {}

}
