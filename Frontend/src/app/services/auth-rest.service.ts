import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendURL } from './endpoint';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthRestService {

  constructor( private http:HttpClient ) { }
  endpoint = new BackendURL().url+'/auth';


  login(user:User){
    return this.http.post(`${this.endpoint}/login`, user);
  }

  register(user:User){
    return this.http.post(`${this.endpoint}/register`, user);
  }

  logout(){
    localStorage.removeItem('currentUser');
  }

}
