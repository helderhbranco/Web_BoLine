import { Component, Input, OnInit } from '@angular/core';
//import {UserService } from '../Services/user-rest-service.service';
import { User } from '../models/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  user!: User;;

  constructor(
    //private UserService: UserService
  ) { }


  ngOnInit(): void {
    //this.getUser();
  }


  /*
  getUser(): void {
    if (this.user && this.user._id) { // Verifica se this.user e this.user._id não são undefined
      this.UserService.getUser(this.user._id).subscribe(user => this.user = user);
    }
  }
  */

  /*
  updateUser(): void {
    if (this.user && this.user._id) { // Verifica se this.user e this.user._id não são undefined
      this.UserService.updateUser(this.user._id, this.user).subscribe(user => this.user = user);
    }
  */
}
