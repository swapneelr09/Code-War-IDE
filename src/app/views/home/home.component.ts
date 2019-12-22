import { Component, OnInit } from '@angular/core';

declare var VANTA;
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //VANTA.NET({ el: "#vantajs" })
    //VANTA.NET("#vantajs");
  }

}
