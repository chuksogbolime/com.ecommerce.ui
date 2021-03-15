import { Component, OnInit, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { RouterModule } from '@angular/router';
//import {MatIcon} from '@angular/material/icon'

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  title = GlobalConstants.siteTitle
  constructor() { }

  ngOnInit(): void {
    //this.title.emit("Ecommerce App")
  }

}
