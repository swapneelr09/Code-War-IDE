import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

declare var particlesJS: any;

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  data : any
  constructor(private api : ApiService) { }

  ngOnInit() {
    particlesJS.load('particles-js', 'assets/particles.json', null);

    this.api.leaderboard().subscribe(data =>{
      console.log(data)
      this.data = data
    })  
  }

  getTime(sec){
    let h = ("0" + Math.floor(sec / 3600)).slice(-2);
    let m = ("0" + Math.floor(sec % 3600 / 60)).slice(-2);
    let s = ("0" + Math.floor(sec % 3600 % 60)).slice(-2);
    return h+":"+m+":"+s;
  }

}
