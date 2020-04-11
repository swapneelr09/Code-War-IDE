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
  title = "CODE WAR";
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
  d : any
  leaderboardData : any
  submissionData : any
  timeData : any
  mail : any
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
      let email = this.name['email']
      this.mail = email
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
     
      this.api.userTime(email).subscribe(data =>{
        this.timeData = data
        this.startTime(email)
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

  startTime(email){
    const self = this
    if(this.timeData['updateTime'] == ''){
        self.d = 60*60*2
    }
    else{
      self.d = Number(this.timeData['updateTime'])
    }   
    var check = -1      
    this.interval = setInterval(function(){
       if(self.d <= 0){
          console.log('times up');
          self.endTime()
       }
       var h = ("0" + Math.floor(self.d / 3600)).slice(-2);
       var m = ("0" + Math.floor(self.d % 3600 / 60)).slice(-2);
       var s = ("0" + Math.floor(self.d % 3600 % 60)).slice(-2);
        if( parseInt(m) % 2 == 0 && parseInt(m) != check){
          self.updateData(email, String(self.d))
          check = parseInt(m)
          console.log(check)
        }
       self.time = h+" : "+m+" : "+s;
       self.d-=1;
    }, 1000);
  }

  endTime(){
    clearInterval(this.interval);
    this.cookieService.delete('User');
    this.updateData(this.mail, '')
    this.router.navigateByUrl('/finish');
  }

  updateData(email, d){
    this.api.changeTime(email, String(d)).subscribe(data =>{})
  }
}
