/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;
  isShowPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fireAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  get name(){
    return this.credentials.get('name');
  }

  get surname() {
    return this.credentials.get('surname');
  }
  get username(){
    return this.credentials.get('username');
  }

  get email() {
    return this.credentials.get('email');
  }
  get password(){
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      surname: ['', [Validators.required, Validators.minLength(1)]],
      username: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  async signup() {

    this.isLoading = true;
    this.loadingController.create({
      keyboardClose: true,
      message: 'Please wait while creating account!'
    }).then(loadingEl => {
      loadingEl.present();
      const authObservable: Observable<AuthResponseData> = this.authService.signup(this.email.value, this.password.value);

      authObservable.subscribe(responseData => {
        this.authService.addUser(this.name.value, this.surname.value, this.username.value, this.email.value, this.password.value).subscribe();
        this.isLoading = false;
        loadingEl.dismiss();
        this.onCancel();
        this.authService.setLoggedInUserEmail(this.email.value);
        this.router.navigateByUrl('/dashboard/tabs/products');
        this.credentials.reset();
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

  async presentLoadingWithOptions(loadingMessage: string) {
   const loading = await this.loadingController.create({
     spinner: 'circles',
     duration: 5000,
     message: loadingMessage,
     translucent: true,
     cssClass: 'custom-class custom-loading',
     backdropDismiss: true
   });
   await loading.present();

   const { role, data } = await loading.onDidDismiss();
   this.router.navigateByUrl('/home/' + this.email.value);
   this.credentials.reset();
 }

 async presentAlert(alertMessage: string, alertSubtitle: string) {
   const alert = await this.alertCtrl.create({
     cssClass: 'my-custom-class',
     header: 'Sign Up Authentication',
     subHeader: alertSubtitle,
     message: alertMessage,
     buttons: ['OK']
   });

   await alert.present();

   const { role } = await alert.onDidDismiss();
 }


  showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed!',
      message,
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    });
}

onCancel() {
  this.modalCtrl.dismiss(null, 'cancel');
}

}
