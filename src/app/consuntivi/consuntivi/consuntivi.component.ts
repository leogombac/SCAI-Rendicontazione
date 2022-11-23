import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-consuntivi',
  templateUrl: './consuntivi.component.html',
  styleUrls: ['./consuntivi.component.css']
})
export class ConsuntiviComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

}
