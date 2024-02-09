import { Component, OnInit } from '@angular/core';
import { UserRestService } from '../Services/user-rest.service';

@Component({
  selector: 'app-user-tickets',
  templateUrl: './user-tickets.component.html',
  styleUrls: ['./user-tickets.component.css']
})
export class UserTicketsComponent implements OnInit {
  tickets: any[] = [];
  displayedColumns: string[] = ['evento', 'data', 'monument', 'price'];

  constructor(private service: UserRestService) { }

  ngOnInit(): void {
    this.service.getTickets().subscribe(
      (res: any) => {
        this.tickets = res;
      }
    );
  }

  clickedRows = new Set<any>();
}
