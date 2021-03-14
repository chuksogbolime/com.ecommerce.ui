import { Component, OnInit, Output } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';


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
