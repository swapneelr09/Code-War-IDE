import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http : HttpClient) { }

  testApi(){
    return this.http.get('http://localhost/kritanjApi/')
    .subscribe(data => {
      console.log("We got "+JSON.stringify(data))
    })
  }

  getQuestion(){
    return this.http.get('http://localhost/kritanjApi/getQuestion/')
  }

  getLanguage(){
    return this.http.get('http://localhost/kritanjApi/getLanguage/')
  }
  
  compile(codeContent, lang, openInput){
    let body = new FormData();
    body.append('codeContent', codeContent);
    body.append('language', lang);
    body.append('customInput', openInput)
    return this.http.post('http://localhost/kritanjApi/compile/', body)
  }

  submit(codeContent, lang, questionNo, email){
    let body = new FormData();
    body.append('codeContent', codeContent);
    body.append('language', lang);
    body.append('questionNo', questionNo)
    body.append('email', email)
    return this.http.post('http://localhost/kritanjApi/submit/', body)
  }

  time(){
    return this.http.get('http://localhost/kritanjApi/time/')
  }

  login(email, phone){
    let body = new FormData();
    body.append('email', email);
    body.append('password', phone);
    return this.http.post('http://localhost/kritanjApi/login/', body)
  }

  mySubmission(email){
    let body = new FormData();
    body.append('email', email);
    return this.http.post('http://localhost/kritanjApi/mySubmission/', body)
  }

  start(email){
    let body = new FormData();
    body.append('email', email);
    return this.http.post('http://localhost/kritanjApi/start/', body)
  }

  leaderboard(){
    return this.http.get('http://localhost/kritanjApi/leaderboard/')
  }
}
