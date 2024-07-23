import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private menu: MenuController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router) {}

  closeSideDrawer() {
    if (this.menu.isOpen()) {
      this.menu.close();
    }
  }

  async presentToastWithOptions() {
    this.closeSideDrawer();

    const toast = await this.toastController.create({
      message: 'Feature currently unavailable',
      icon: 'information-circle',
      position: 'bottom',
      buttons: [
          {
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      duration: 4000
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

}
