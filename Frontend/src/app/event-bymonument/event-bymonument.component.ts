import { Component, OnInit } from '@angular/core';
import { MonumentRestServiceService } from '../Services/monument-rest-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-bymonument',
  templateUrl: './event-bymonument.component.html',
  styleUrls: ['./event-bymonument.component.css']
})
export class EventBymonumentComponent implements OnInit{


  events:any;
  id!:number;

  constructor(private eventRestServiceService:MonumentRestServiceService,private rouite:ActivatedRoute){

  }


  ngOnInit(){
    this.rouite.params.subscribe(params=>{ this.id = params['id'];});
    this.getEventByMonumentId(this.id);
  }

  getEventByMonumentId(id:number){
    this.eventRestServiceService.getEventByMonumentId(id).subscribe((data:any)=>{
      console.log(data);
      this.events = data;
    });
  }


}
