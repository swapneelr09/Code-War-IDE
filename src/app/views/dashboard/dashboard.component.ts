import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

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
  currentTime : any
  startAt : any
  endAt : any
  interval : any
  time : any
  name = ""
  leaderboardData : any
  submissionData : any
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
  constructor(private api : ApiService, private cookieService: CookieService, private router: Router) { 
    
  }

ngOnInit() {
    if(this.cookieService.check('User'))
    {
      this.name = JSON.parse(this.cookieService.get('User'))
      this.name = this.name['name']
      this.id = 3
      this.selectedTheme = this.themes.light[0][1]
      this.api.getQuestion().subscribe(data =>{
        this.question = data
      })
      
      this.api.getLanguage().subscribe(data =>{
        this.language = data
        this.selectedLang = 0
      })

      this.api.time().subscribe(data =>{
        this.currentTime = data
        this.currentTime = parseInt(this.currentTime)
        this.startTime(this.currentTime)
      })
    }
    else{
      this.router.navigateByUrl('/');
    }
  }

  addClass(id){
    this.id = id
    if(this.id == 7){
      this.api.mySubmission(JSON.parse(this.cookieService.get('User'))['email']).subscribe(data =>{
        this.submissionData = data
      },error  => {
        console.log("Error", error);
      })
    }  
    else if(this.id >= 3){
      this.questionSelected = this.id - 3
    }
    else if(this.id == 1){
      this.api.leaderboard().subscribe(data =>{
        this.leaderboardData = data
      })
    }
    
  }

  startTime(current_time){
    let userCookie = JSON.parse(this.cookieService.get('User'))
    if(userCookie['startedAt'] == ''){
      userCookie['startedAt'] = current_time
      this.startAt = current_time
      this.cookieService.set( 'User', JSON.stringify(userCookie), 1/12);
    }
    else{
      this.startAt = userCookie['startedAt']
    }
    let limit = 60*60*2  
    this.endAt = this.startAt + limit
    const self = this;          
    this.interval = setInterval(function(){
       if(self.endAt - current_time <= 0){
          console.log('times up');
          this.endTime()
       }
       var d = Number((self.endAt - current_time));
       var h = ("0" + Math.floor(d / 3600)).slice(-2);
       var m = ("0" + Math.floor(d % 3600 / 60)).slice(-2);
       var s = ("0" + Math.floor(d % 3600 % 60)).slice(-2);
       self.time = h+" : "+m+" : "+s;
       current_time+=1;
    }, 1000);
  }

  endTime(){
    this.cookieService.delete('User');
    this.router.navigateByUrl('/finish');
  }
}
