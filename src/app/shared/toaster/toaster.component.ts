import { Component, OnInit } from '@angular/core';
import { ToastLevel } from 'src/app/models/toast';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  ToastLevel = ToastLevel;

  constructor(
    public ts: ToasterService
  ) { }

  ngOnInit(): void {
  }

}
