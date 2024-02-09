import { Injectable } from '@angular/core';
import {Event} from '../models/Event';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventRestServiceService {

  constructor(private http: HttpClient) { }


  getEvents(){
    return this.http.get<Event[]>('http://localhost:3000/api/v1/event/getAll');
  }

  getEventById(id:number){
    return this.http.get<Event>('http://localhost:3000/api/v1/event/getById/'+id);
  }

  getQuantity(qunt:number,id:number){
    return this.http.get<any>('http://localhost:3000/api/v1/ticket/free/'+id+'/'+qunt);
  }

  buyTicket(id:number,quant:number,quantfree:number){
    return this.http.post<any>('http://localhost:3000/api/v1/ticket/buy/'+id+'/'+quant+'/'+quantfree,{});
  }
}
