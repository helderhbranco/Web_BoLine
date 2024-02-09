import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthRestService } from 'src/app/Services/auth-rest.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private form: FormBuilder,
    private toastr: ToastrService,
    private service: AuthRestService,
    private router: Router
  ) { }

  user: User = new User('', '');

  registerForm: FormGroup = this.form.group({
    name: this.form.control('', [Validators.required , Validators.pattern(/^(?:[A-Z][a-z]{2,}(?: [A-Z][a-z]{2,}){0,5}) [A-Z][a-z]{2,}$/)]),
    email: this.form.control('', [Validators.required, Validators.email]),
    confirmEmail: this.form.control('', [Validators.required, Validators.email,]),
    password: this.form.control('', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]),    
    confirmPassword: this.form.control('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]),
    status: this.form.control(true),
    role: this.form.control('USER'),
  });

  register() {

    if(this.registerForm.value.email != this.registerForm.value.confirmEmail){
      this.toastr.warning('Emails do not match!');
      return;
    }

    if(this.registerForm.value.password != this.registerForm.value.confirmPassword){
      this.toastr.warning('Passwords do not match!');
      return;
    }

    console.log(this.registerForm.value);

    if (this.registerForm.valid) {
     
      this.service.register(this.registerForm.value).subscribe(res=>{
        this.toastr.success('Registered successfully!');
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/login']);
      }, err=>{
        this.toastr.error(err.error.message);
      });
    } else {
      this.toastr.error('Please enter valid data!');
    }
  }
}
