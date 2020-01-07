import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-compiler',
  templateUrl: './compiler.component.html',
  styleUrls: ['./compiler.component.css']
})
export class CompilerComponent implements OnInit {
  disp = false
  @Input() dis
  msg : any
  output: any
  show = false
  @Input() compile;
  @Input() submitData;
  score = 0
  fullMark = 0
  @Output() submit: EventEmitter<string> = new EventEmitter<string>() 
  constructor() { }

  ngOnInit() {
    this.msg = "Compiling...."
    this.output = ""
  }

  ngOnChanges(change){
    if('compile' in change){
      if(this.compile == 0){
        this.msg = "Queuing..."
        this.output = ""
        this.show = false
      }
      else{
        this.msg = this.compile["message"]
        this.output = this.compile["data"]
        if(this.compile["type"] === "CA"){
          this.show = true
        }
      }
    }
    
    if('dis' in change){
      this.disp = false
      this.msg = "Compiling...."
      this.output = ""
      this.show = false
    }

    if('submitData' in change){
      if(this.submitData == 0){
        this.msg = "Submitting...In a Queue"
        this.output = ""
      }
      else{
        this.disp = !this.disp
        this.score = 0
        this.fullMark = 0
        let s = 0
        let f = 0
        this.submitData.forEach(val => {
          s = s + parseInt(val.mark)
          f = f + parseInt(val.fullMark)
        });
        this.score = s
        this.fullMark = f
      }
    }
  }

  submitCode(){
    this.msg = "Submitting...Please Wait"
    this.output = ""
    this.submit.emit("submit")
  }

  setIcon(item){
    console.log(item)
    if(item){
      return '<i class="material-icons" style="font-size:36px; color:#82CC00">thumb_up</i>'
    }
    else{
      return '<i class="material-icons" style="font-size:36px; color:#82CC00">thumb_down</i>';
    }
  }
}
