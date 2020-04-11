import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiUrl : string
  constructor(private http : HttpClient) { 
    this.apiUrl = 'https://'+window.location.hostname+'/kritanjApi/'
  }

  testApi(){
    return this.http.get('http://localhost/kritanjApi/')
    .subscribe(data => {
      console.log("We got "+JSON.stringify(data))
    })
  }

  getQuestion(){
    return this.http.get(this.apiUrl+'getQuestion/')
  }

  getLanguage(){
    return this.http.get(this.apiUrl+'getLanguage/')
  }
  
  compile(codeContent, lang, openInput){
    let body = new FormData();
    body.append('codeContent', codeContent);
    body.append('language', lang);
    body.append('customInput', openInput)
    return this.http.post(this.apiUrl+'compile/', body)
  }

  submit(codeContent, lang, questionNo, email, now){
    let body = new FormData();
    body.append('codeContent', codeContent);
    body.append('language', lang);
    body.append('questionNo', questionNo)
    body.append('email', email)
    body.append('now', now)
    return this.http.post(this.apiUrl+'submit/', body)
  }

  time(){
    return this.http.get(this.apiUrl+'time/')
  }

  login(email, phone){
    let body = new FormData();
    body.append('email', email);
    body.append('password', phone);
    return this.http.post(this.apiUrl+'login/', body)
  }

  signup(email, phone, name, team){
    let body = new FormData();
    body.append('email', email);
    body.append('mobile', phone);
    body.append('name', name);
    body.append('team', team);
    return this.http.post(this.apiUrl+'signup/', body)
  }

  mySubmission(email){
    let body = new FormData();
    body.append('email', email);
    return this.http.post(this.apiUrl+'mySubmission/', body)
  }

  start(email){
    let body = new FormData();
    body.append('email', email);
    return this.http.post(this.apiUrl+'start/', body)
  }

  userTime(email){
    let body = new FormData();
    body.append('email', email);
    return this.http.post(this.apiUrl+'usertime/', body)
  }

  changeTime(email, d){
    let body = new FormData();
    body.append('email', email);
    body.append('d', d);
    return this.http.post(this.apiUrl+'changetime/', body)
  }

  changeStart(email, start){
    let body = new FormData();
    body.append('email', email);
    body.append('start', start);
    return this.http.post(this.apiUrl+'changestart/', body)
  }

  leaderboard(){
    return this.http.get(this.apiUrl+'leaderboard/')
  }
}
