import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthRestService } from 'src/app/Services/auth-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private form: FormBuilder,
    private toastr: ToastrService,
    private service: AuthRestService,
    private router: Router
  ) { 
    sessionStorage.clear();
    localStorage.clear();
  }

  loginForm: FormGroup = this.form.group({
    email:this.form.control('', [Validators.required, Validators.email]),
    password:this.form.control('', Validators.required),
  });

  login(){
    if(this.loginForm.valid){

      this.service.login(this.loginForm.value).subscribe(res=>{
        this.toastr.success('Logged in successfully!');
        localStorage.setItem('currentUser', JSON.stringify(res));
        localStorage.setItem('lastURL', location.pathname.toString());
        this.router.navigateByUrl('/home');
      }, err=>{
        this.toastr.error(err.error.message);
      });
    }
  }
}
