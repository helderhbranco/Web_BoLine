import { Component, DoCheck, OnInit } from '@angular/core';
import { UserRestService } from '../Services/user-rest.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements DoCheck, OnInit {
  islogged: boolean = false;
  user: string = '';
  currentUser = localStorage.getItem('currentUser');

  constructor(private service: UserRestService) {}

  ngOnInit(): void {
    this.service.getUser().subscribe(
      (res: any) => {
        console.log(res);
        if (this.currentUser && this.islogged) {
          localStorage.setItem('user', JSON.stringify({ auth: res.auth, user: res.user.name }));
          if (
            localStorage.getItem('lastURL') &&
            localStorage.getItem('lastURL') === '/login'
          ) {
            localStorage.removeItem('lastURL');
            document.location.reload();
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  
    let stored = JSON.parse(localStorage.getItem('user') || '{}');
    if (stored && stored.auth) {
      this.user = stored.user;
    }
  }
  

  ngDoCheck(): void {
    if (this.currentUser) {
      const currentUserObj = JSON.parse(this.currentUser);
      // verifica se o usuário está logado
      const auth = currentUserObj.auth;
      if (auth) {
        this.islogged = true;
      } else {
        this.islogged = false;
      }
    } else {
      this.islogged = false;
    }
  }
}
