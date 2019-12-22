import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

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
    this.setEditor()
   }

   if('activeLang' in change){
    this.setEditor()
   }

  }

  setEditor(){
    this.editor.setSession(this.sessionStore[parseInt(this.sessionRow) + parseInt(this.activeLang)]);
    this.editor.session.setMode("ace/mode/"+this.lang[this.activeLang].file);
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
