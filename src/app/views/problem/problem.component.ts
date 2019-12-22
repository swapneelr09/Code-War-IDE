import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
  @Input() qs;
  @Input() qSelected;
  openQuestion : any ={}
  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges(){
    this.openQuestion = this.qs[this.qSelected]
  }
}
