import { Component, OnInit } from '@angular/core';
import { TicketRestServiceService } from '../Services/ticket-rest-service.service';
import { EventRestServiceService } from '../Services/event-rest-service.service';
import { ActivatedRoute } from '@angular/router';
import { render } from 'creditcardpayments/creditCardPayments';
import { Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  quantidade: number = 0;
  preco: number = 0;
  event: any;
  preco_total: number = 0;
  id!: number;
  realquantity: any;
  usePoints!: boolean;
  valordegratis: number = 0;

  tax = {
    amount: 0.5,
    name: "Taxa de processamento"
  }

  constructor(
    private router: Router,
    private eventRestServiceService: EventRestServiceService,
    private ticketRestServiceService: TicketRestServiceService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.realquantity = 0;
  }

  async getQuantity(qunt: number, id: number) {
    try {
      const data = await this.eventRestServiceService.getQuantity(qunt, id).toPromise();
      this.realquantity = data['number'];
      console.log("(get) : " + this.realquantity);
    } catch (error) {
      console.log(error);
    }
  }

  temp(id: number): void {
    this.eventRestServiceService.getEventById(id).subscribe(async (data: any) => {
      this.event = data;
      console.log(this.quantidade * this.event.price);

      if (this.quantidade.toString() == "null") {
        this.toastr.warning("No quantity selected")
      }

      if (this.quantidade <= 0 || this.quantidade > this.event.capacity - this.event.instante_capacity) {
        this.toastr.warning("Invalid quantity selected")
      }

      this.preco_total = Number(this.event.price) * this.quantidade;
      console.log("SubTotal : " + this.preco_total);

      if (this.usePoints.valueOf() == true) {
        console.log("Real quantity : " + this.realquantity);
        
        this.valordegratis = Number(this.realquantity) * Number(this.event.price);
        console.log("Desconto : " + this.valordegratis + " (qntd : " + this.realquantity + " price :" + this.event.price + ")");
        
        this.preco_total = this.preco_total - this.valordegratis;
        console.log("Total : " + this.preco_total);
      } else { 
        this.realquantity = 0;
      }

      this.preco_total += this.tax.amount;

      render({
        id: "#myPaypalButtons",
        currency: "USD",
        value: this.preco_total.toString(),
        onApprove: (details: any) => {
          this.eventRestServiceService.buyTicket(this.id, this.quantidade, this.realquantity).subscribe((data: any) => {
            console.log(data);
          });
          //alert("Transaction successful");
          this.toastr.success('Compra efetuada com sucesso!');
          this.router.navigate(['/']);
        }
      });
    });
  }

  async loadQuantity() {
    const data = await this.eventRestServiceService.getQuantity(this.quantidade, this.id).toPromise();
    console.log("(load) : " + data['number']);
    this.realquantity = Number(data['number']);
  }

  async getEventById(id: number) {
    try {
      const data = await this.eventRestServiceService.getEventById(id).toPromise();
      this.event = data;
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.quantidade = params['quantidade'];
      this.id = params['id'];
      this.usePoints = params['usePointsCheckbox'] === 'true'; // Converter para booleano
      await this.loadQuantity();
      this.temp(this.id);
    }, err => {
      this.toastr.error(err.error.message);
    });
  }

}
