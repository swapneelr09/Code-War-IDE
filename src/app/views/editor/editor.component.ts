import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../api.service';
import { CookieService } from 'ngx-cookie-service';

declare var ace : any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() activeTheme : any;
  @Input() qs;
  @Input() qSelected;
  @Input() lang;
  @Input() activeLang;
  curQs : any;
  curTheme : any;
  curLang : any;
  editor : any;
  EditSession : any;
  openInput : any = {};
  showInput = false;
  sessionStore :  any = []
  sessionRow: any;
  swipe : any;
  view = "Compile"
  compileData : any;
  disply : any
  submit :  any
  constructor(private api : ApiService, private cookieService: CookieService) { }

  ngOnInit() {
    this.editor = ace.edit("editor");
    this.EditSession = ace.EditSession;
    
    this.editor.setTheme("ace/theme/"+this.activeTheme);
    
    this.curTheme = this.activeTheme
    
    this.editor.session.setMode("ace/mode/c_cpp");
    
    this.editor.commands.addCommand({
      name: "undo",
      exec: this.editor.undo(),
      bindKey: { win: "ctrl-z", mac: "cmd-z" }
    });
   
    this.editor.commands.addCommand({
      name: "redo",
      exec: this.editor.redo(),
      bindKey: { win: "ctrl-y", mac: "cmd-y" }
    });
       
    this.editor.setOptions({
      'fontSize': 17,
      'behavioursEnabled': true,
      'wrapBehavioursEnabled': false,
      'wrap': true,
      'indentedSoftWrap': false,
      'enableLiveAutocompletion': true,
   });
  }

  ngOnChanges(change){
   
    if('lang' in change){
    this.openInput = this.qs[this.qSelected].samples[0].input;
    this.sessionRow = this.qs.length*this.qSelected
    
    var self = this
    this.qs.forEach(function(){
      self.lang.forEach(function(value){
        self.sessionStore.push(new self.EditSession(value.code));
      })
    })
   }

   if('activeTheme' in change){
    this.editor.setTheme("ace/theme/"+this.activeTheme)
   }

   if('qSelected' in change){
    this.openInput = this.qs[this.qSelected].samples[0].input;
    this.sessionRow = this.qs.length*this.qSelected;
    this.disply = "q"+this.qSelected
    this.setEditor()
   }

   if('activeLang' in change){
    this.disply = "l"+this.activeLang 
    this.setEditor()
   }

  }

  setEditor(){
    this.editor.setSession(this.sessionStore[parseInt(this.sessionRow) + parseInt(this.activeLang)]);
    this.editor.session.setMode("ace/mode/"+this.lang[this.activeLang].file);
    this.swipe = "0";
    this.view = "Compile";
    this.compileData = ""
  }
  dispInput(event){
    if ( event.target.checked ) {
      this.showInput = true;
    }
    else{
      this.showInput = false;
    }
  }

  compileFunc(){
    let self = this
      this.api.compile(this.editor.getValue(), this.lang[this.activeLang].str, this.openInput).subscribe(data =>{
        self.compileData = data
        if(data == 0){
          setTimeout(() => {
            this.compileFunc()}, 5000)
        }
        else{
          console.log(self.compileData)
        }
      },error  => {
        console.log("Error", error);
      })
  }

  submitFunc(){
      this.api.submit(this.editor.getValue(), this.lang[this.activeLang].str, this.qSelected, JSON.parse(this.cookieService.get('User'))['email']).subscribe(data =>{
        this.submit = data
        if(data == 0){
          setTimeout(() => {
            this.submitFunc()}, 5000)
        }
      },error  => {
        console.log("Error", error);
      })
  }

  swipeDiv(){
    if(this.view === "Compile"){
      this.disply = new Date().getTime()
      this.compileFunc()
      this.swipe = "-53vw";
      this.view = "Back";
    }
    else{
      this.swipe = "0";
      this.view = "Compile";
    }
  }

  submitCode(submit){
    this.submitFunc()
  }
}
