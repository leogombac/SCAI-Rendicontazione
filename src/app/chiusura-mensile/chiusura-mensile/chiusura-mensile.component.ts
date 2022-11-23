import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chiusura-mensile',
  templateUrl: './chiusura-mensile.component.html',
  styleUrls: ['./chiusura-mensile.component.css']
})
export class ChiusuraMensileComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

}
