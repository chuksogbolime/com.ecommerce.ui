import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
//import {MatIcon} from '@angular/material/icon'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title=GlobalConstants.siteTitle
  constructor() { }

  ngOnInit(): void {
  }

}
