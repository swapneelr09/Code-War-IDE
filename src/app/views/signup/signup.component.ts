import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

declare var particlesJS: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  msg = ""
  constructor(private api : ApiService, private router: Router) { }

  ngOnInit() {
    particlesJS.load('particles-js', 'assets/particles.json', null);
  }

  loginUser(form: NgForm) {
    if(form.value.email!='' && form.value.phone!='' && this.validateEmail(form.value.email) && form.value.team!='' && form.value.name!=''){
      this.msg = ""
      this.api.signup(form.value.email, form.value.phone, form.value.name, form.value.team).subscribe(data =>{
        console.log(data)
        if(data['error'] ==  false){
          this.msg = "Registration Successful! Now Login"
          let self = this
          setTimeout(function(){
            self.router.navigateByUrl('/');
          },1000);
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
}
