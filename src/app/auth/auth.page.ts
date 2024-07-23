import { SignupPage } from './signup/signup.page';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../services/auth.service';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  credentials: FormGroup;
  isLoading = false;
  isShowPassword = false;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private router: Router,
    private fireAuth: AngularFireAuth
  ) { }

  get email(){
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging in...'
    }).then(loadingEl => {
      loadingEl.present();
      const authObservable: Observable<AuthResponseData> = this.authService.login(email, password);

      authObservable.subscribe(responseData => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.authService.setLoggedInUserEmail(email);
        this.router.navigateByUrl('/dashboard/tabs/products');
      }, errorResponse => {
        loadingEl.dismiss();
        const code = errorResponse.error.error.message;
        let message = 'Could not sign you up. Please try again.';

        switch(code) {
          case 'EMAIL_EXISTS':
            message = 'This email address already exists';
            break;
          case 'EMAIL_NOT_FOUND':
            message = 'Email address could not be found.';
            break;
          case 'INVALID_PASSWORD':
            message = 'This password is invalid';
            break;
        }

        this.showAlert(message);
      });
    });


  }

  onSubmit() {
    if (!this.credentials.valid) {
      return;
    }

    const email = this.credentials.value.email;
    const password = this.credentials.value.password;

   this.authenticate(email, password);
    this.credentials.reset();
  }

  async presentModalSignUp() {
    const modal = await this.modalCtrl.create({
      component: SignupPage,
      breakpoints: [0, 0.3, 0.5, 0.8, 0.9],
      initialBreakpoint: 0.8,
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
  }

  async presentModalForgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.6,
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed!',
      message,
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
