import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'login';
  loading = false;
  serverMessage: unknown;

  constructor(
    private profileService: ProfileService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []],
    });
  }

  changeType(val: 'login' | 'signup' | 'reset') {
    if (val === 'signup') {
      this.setRequired();
    }
    if (val === 'login') {
      this.unsetRequired();
    }
    this.type = val;
  }

  setRequired() {
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['passwordConfirm'].setValidators([Validators.required]);
  }

  unsetRequired() {
    this.form.controls['name'].setValidators(null);
    this.form.controls['passwordConfirm'].setValidators(null);
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password?.value === this.passwordConfirm?.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const name = this.name?.value;
    const email = this.email?.value;
    const password = this.password?.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
        this.router.navigate(['/', 'kanban']);
      }
      if (this.isSignup) {
        var photoURL =
          'https://api.dicebear.com/5.x/avataaars-neutral/svg?seed=' + name;
        var uid: string;
        await this.afAuth.createUserWithEmailAndPassword(email, password);
        await this.afAuth.authState.subscribe((result) => {
          if (result) {
            uid = result.uid;
            this.profileService.createUserData({
              name: name,
              email: email,
              uid: uid,
              photoURL: photoURL,
            });
          }
        });
        this.router.navigate(['/', 'kanban']);
      }
      if (this.isLogin) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Check your email';
      }
    } catch (error) {
      this.serverMessage = error;
    }
    this.loading = false;
  }
}
