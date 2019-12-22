import { Component, OnInit } from '@angular/core';

declare var VANTA;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //VANTA.NET({ el: "#vantajs" })
    //VANTA.NET("#vantajs");
  }

}
