import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendURL } from './endpoint';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {
  constructor( private http:HttpClient ) { }
  endpoint = new BackendURL().url+'/user';

  updateUser(formData: FormData): Observable<any> {
    return this.http.put(`${this.endpoint}/edit`, formData);
  }

  getUser(){
    return this.http.get(`${this.endpoint}/show`);
  }

  getTickets(){
    return this.http.get(`${this.endpoint}/tickets`);
  }

}
