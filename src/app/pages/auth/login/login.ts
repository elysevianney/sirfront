import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  onSubmit() {
    console.log(this.email, this.password);
  }
}
