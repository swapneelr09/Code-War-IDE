import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
    
  }
  
  getTime(sec){
    let h = ("0" + Math.floor(sec / 3600)).slice(-2);
    let m = ("0" + Math.floor(sec % 3600 / 60)).slice(-2);
    let s = ("0" + Math.floor(sec % 3600 % 60)).slice(-2);
    return h+":"+m+":"+s;
  }
}
