import { Injectable } from '@angular/core';
import {Monument} from '../models/Monument';
import {Event} from '../models/Event';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MonumentRestServiceService {

  constructor(private http: HttpClient) { }

  getMonuments(){
    return this.http.get<Monument[]>('http://localhost:3000/api/v1/monument/getAll');
  }

  getEventByMonumentId(id:number){
    return this.http.get<Event[]>('http://localhost:3000/api/v1/monument//getEventByMonumentId/'+id);
  }
}
