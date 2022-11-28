import { Component, OnInit } from '@angular/core';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-consuntivi',
  templateUrl: './consuntivi.component.html',
  styleUrls: ['./consuntivi.component.css']
})
export class ConsuntiviComponent implements OnInit {

  constructor(
    public userService: UserService,
    private chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {
  }

}
