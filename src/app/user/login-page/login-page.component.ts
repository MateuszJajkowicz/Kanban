import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.checkAuthState();
  }

  checkAuthState() {
    if (this.afAuth.authState) {
      this.router.navigate(['/profile']);
    }
  }
}
