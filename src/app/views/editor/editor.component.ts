import { Component, OnInit, Input } from '@angular/core';

declare var ace : any;
declare var require : any;

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
  constructor() { }

  ngOnInit() {
    this.editor = ace.edit("editor");
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
    //this.EditSession = ace.EditSession;
    /*this.editor.setTheme("ace/theme/"+this.activeTheme)
    this.openInput = this.qs[this.qSelected].samples[0].input;
    this.EditSession = ace.EditSession;
    var self = this;
    this.lang.forEach(function(value){
        self.sessionStore.push(new this.EditSession(value.code));
    });
    this.editor.setSession(this.sessionStore[this.activeLang]);
    this.editor.session.setMode("ace/mode/"+this.lang[this.activeLang].file);
    this.editor.on('change', () => {
      console.log("Hello")
   });*/
   /*if(this.curTheme != this.activeTheme){
    this.editor.setTheme("ace/theme/"+this.activeTheme)
    this.curTheme = this.activeTheme
   }*/
   if('activeTheme' in change){
    this.editor.setTheme("ace/theme/"+this.activeTheme)
   }
   /*if(this.sessionStore.length == 0){
     console.log("Hello")
   }*/
  }


  dispInput(event){
    if ( event.target.checked ) {
      this.showInput = true;
    }
    else{
      this.showInput = false;
    }
  }

}
