import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

declare var particlesJS: any;
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  msg = ""
  rules = false
  user : any
  constructor(private api : ApiService, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {   
    particlesJS.load('particles-js', 'assets/particles.json', null);
  }

  loginUser(form: NgForm) {
    if(form.value.email!='' && form.value.phone!='' && this.validateEmail(form.value.email)){
      this.msg = ""
      this.api.login(form.value.email, form.value.phone).subscribe(data =>{
        if(data['error'] ==  false){
          this.rules = true
          this.user = data['data']
        }
        else{
          this.msg = 'Error : Invalid Credentials.';
        }
      },error  => {
        console.log("Error", error);
      })
    }
    else{
      this.msg = 'Error : Invalid or blank field.';
   }
  }

  validateEmail(mail){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mail).toLowerCase());
  }

  startTime(){
    if(this.cookieService.check('User')){
      let email = JSON.parse(this.cookieService.get('User'))
      email = email['email']
      if(this.user['email'] === email){
        this.router.navigateByUrl('/dashboard');
      }
      else{
        this.newUser()
      }
    }
    else{
      this.newUser()
    }
    this.router.navigateByUrl('/dashboard');
  }

  newUser(){
    this.cookieService.set( 'User', JSON.stringify(this.user));
        this.api.start(this.user['email']).subscribe(data => {
        
        },error  => {
            console.log("Error", error);
        })
  }
}
