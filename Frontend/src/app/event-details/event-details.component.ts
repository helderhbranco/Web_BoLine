import { Component, OnInit } from '@angular/core';
import { EventRestServiceService } from '../Services/event-rest-service.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  usePoints: boolean = false;
  quantidadeTickets: number = 1;
  event: any;
  id!: number;

  constructor(
    private form: FormBuilder,
    private eventRestServiceService: EventRestServiceService,
    private route: ActivatedRoute
  ) {
  }

  quantidadeTicketsForm: FormGroup = this.form.group({
    quantidadeTickets: this.form.control('', [Validators.required, Validators.min(1)]),
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getEventById(this.id);
  }

  getEventById(id: number) {
    this.eventRestServiceService.getEventById(id).subscribe((data: any) => {
      console.log(data);
      this.event = data;
    });
  }

  toggleUsePoints() {
    this.usePoints = !this.usePoints;
  }
}
