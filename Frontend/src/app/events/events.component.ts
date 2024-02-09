import { Component, OnInit } from '@angular/core';
import { EventRestServiceService } from '../Services/event-rest-service.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  uniquePlaces: string[] = [];
  selectedPlace: string = '';

  constructor(private eventRestServiceService: EventRestServiceService) {}

  ngOnInit() {
    console.log("ngOnInit"); 
    this.getEvents();
  }

  getEvents() {
    this.eventRestServiceService.getEvents().subscribe((data: any[]) => {
      console.log(data);
      this.events = data;
      this.filteredEvents = data;
      this.getUniquePlaces();
    });
  }

  getUniquePlaces() {
    this.uniquePlaces = Array.from(new Set(this.events.map(event => event.event_place_name)));
  }

  filterEvents() {
    if (this.selectedPlace) {
      this.filteredEvents = this.events.filter(event => event.event_place_name === this.selectedPlace);
    } else {
      this.filteredEvents = this.events;
    }
  }
}
