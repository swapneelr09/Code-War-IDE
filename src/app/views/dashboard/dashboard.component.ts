import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  section = "Ok";
  test : any = []
  id : number;
  question : any = [];
  language : any = [];
  questionSelected = 0
  public selectedTheme;
  public selectedLang;
  themes = { dark: [
          ["Ambiance"             ,"ambiance"                ,  "dark"],
          ["Chaos"                ,"chaos"                   ,  "dark"],
          ["Clouds Midnight"      ,"clouds_midnight"         ,  "dark"],
          ["Dracula"              ,"dracula"                 ,  "dark"],
          ["Cobalt"               ,"cobalt"                  ,  "dark"],
          ["Gruvbox"              ,"gruvbox"                 ,  "dark"],
          ["Green on Black"       ,"gob"                     ,  "dark"],
          ["idle Fingers"         ,"idle_fingers"            ,  "dark"],
          ["krTheme"              ,"kr_theme"                ,  "dark"],
          ["Merbivore"            ,"merbivore"               ,  "dark"],
          ["Merbivore Soft"       ,"merbivore_soft"          ,  "dark"],
          ["Mono Industrial"      ,"mono_industrial"         ,  "dark"],
          ["Monokai"              ,"monokai"                 ,  "dark"],
          ["Pastel on dark"       ,"pastel_on_dark"          ,  "dark"],
          ["Solarized Dark"       ,"solarized_dark"          ,  "dark"],
          ["Terminal"             ,"terminal"                ,  "dark"],
          ["Tomorrow Night"       ,"tomorrow_night"          ,  "dark"],
          ["Tomorrow Night Blue"  ,"tomorrow_night_blue"     ,  "dark"],
          ["Tomorrow Night Bright","tomorrow_night_bright"   ,  "dark"],
          ["Tomorrow Night 80s"   ,"tomorrow_night_eighties" ,  "dark"],
          ["Twilight"             ,"twilight"                ,  "dark"],
          ["Vibrant Ink"          ,"vibrant_ink"             ,  "dark"],
      ],
      light: [
          ["Chrome"               ,"chrome"                              ],
          ["Clouds"               ,"clouds"                              ],
          ["Crimson Editor"       ,"crimson_editor"                      ],
          ["Dawn"                 ,"dawn"                                ],
          ["Dreamweaver"          ,"dreamweaver"                         ],
          ["Eclipse"              ,"eclipse"                             ],
          ["GitHub"               ,"github"                              ],
          ["IPlastic"             ,"iplastics"                           ],
          ["Solarized Light"      ,"solarized_light"                     ],
          ["TextMate"             ,"textmate"                            ],
          ["Tomorrow"             ,"tomorrow"                            ],
          ["XCode"                ,"xcode"                               ],
          ["Kuroir"               ,"kuroir"                              ],
          ["KatzenMilch"          ,"katzenmilch"                         ],
          ["SQL Server"           ,"sqlserver"                  , "light"],
      ],
      };
  constructor(private api : ApiService) { 
    
  }

ngOnInit() {
    this.id = 3
    this.selectedTheme = this.themes.light[0][1]
    this.api.getQuestion().subscribe(data =>{
      this.question = data
    })
    this.api.getLanguage().subscribe(data =>{
      this.language = data
      this.selectedLang = 0
    })
  }

  addClass(id){
    this.id = id
    if(this.id >= 3){
      this.questionSelected = this.id - 3
    }  
  }



}
