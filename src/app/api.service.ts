import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
