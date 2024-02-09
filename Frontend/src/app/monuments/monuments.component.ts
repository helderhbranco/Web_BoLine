import { Component, OnInit } from '@angular/core';
import { MonumentRestServiceService } from '../Services/monument-rest-service.service';

@Component({
  selector: 'app-monuments',
  templateUrl: './monuments.component.html',
  styleUrls: ['./monuments.component.css']
})
export class MonumentsComponent implements OnInit {
  monuments: any[] = [];
  filteredMonuments: any[] = [];
  selectedName: string = '';

  constructor(private monumentRestServiceService: MonumentRestServiceService) {}

  ngOnInit() {
    this.getMonuments();
  }

  getMonuments() {
    this.monumentRestServiceService.getMonuments().subscribe((data: any[]) => {
      this.monuments = data;
      this.filteredMonuments = data;
    });
  }

  filterMonuments() {
    if (this.selectedName) {
      // Filter monuments based on selected name
      this.filteredMonuments = this.monuments.filter(monument => monument.name === this.selectedName);
    } else {
      // Reset the filter and show all monuments
      this.filteredMonuments = this.monuments;
    }
  }
}
