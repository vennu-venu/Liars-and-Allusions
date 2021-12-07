import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { ImageService } from 'src/app/shared/image.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmitted : boolean = false;
  isWrongCred : boolean = false;

  formTemplate = new FormGroup({
    username : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  constructor(private service : ImageService, private router : Router, public toastr : ToastrService) { }

  ngOnInit(): void {
    this.resetForm();
  }

  async onSubmit(fromValue : any) {
    this.isSubmitted = true;
    this.isWrongCred = false;
    await this.service.logIn(fromValue.username, fromValue.password);
    if(localStorage.getItem('user') !== null) {
      this.router.navigateByUrl('/post');
      this.toastr.success('Welcome', 'Successful Login');
    }
    else {
      this.isWrongCred = true;
      this.toastr.error('Unsuccessful Login', ':(');
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      username:'',
      password:''
    });
    this.isSubmitted = false;
  }

}
