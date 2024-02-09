import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserRestService } from '../Services/user-rest.service';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  disabled:boolean = false;
  editForm: FormGroup;
  user:any;

  imageUrls: string = 'http://localhost:3000/images/users/';
  photo: string = this.imageUrls+'user.png';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: UserRestService,
    private router: Router
  ) {

    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^(?:[A-Z][a-z]{2,}(?: [A-Z][a-z]{2,}){0,5}) [A-Z][a-z]{2,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],    
      confirmPassword: ['', [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
      status: [true],
      role: ['USER'],
    });
  }

  ngOnInit(): void {
    this.service.getUser().subscribe(
      (res: any) => {
        this.user = res['user'];
        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          confirmEmail: this.user.email,
          status: this.user.status,
          role: this.user.role,
        });
      },
      (err) => {
        console.log(err);
      }
    );
    this.editForm.disable();
  }

  edit() {
    if (this.editForm.invalid) {
      this.toastr.error('Please enter valid data!');
      return;
    }

    if (this.editForm.value.email !== this.editForm.value.confirmEmail) {
      this.toastr.warning('Emails do not match!');
      return;
    }

    if (this.editForm.value.password !== '' && this.editForm.value.confirmPassword !== '') {
      if (this.editForm.value.password !== this.editForm.value.confirmPassword) {
        this.toastr.warning('Passwords do not match!');
        return;
      }

      if (!this.editForm.controls['password'].valid || !this.editForm.controls['confirmPassword'].valid) {
        this.toastr.warning('Please enter a valid password!');
        return;
      }
    }

    this.service.updateUser(this.editForm.value).subscribe(
      res => {
        this.toastr.success('Updated successfully!');
        this.disabled = !this.disabled;
        this.toggleEdit();
        location.reload();
      },
      err => {
        this.toastr.error(err.error.message);
      }
    );
  }

  toggleEdit() {
    if (!this.disabled) {
      this.editForm.disable();
    } else {
      this.editForm.enable();
    }
  }
}
