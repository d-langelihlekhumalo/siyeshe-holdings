/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  status = 'FAQs';

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Siyeshe Holdings',
      subHeader: 'Social Media Communication',
      message: 'We are currently setting up our social media presence. Once we are up and running, we will get in touch <strong>#SiyesheHoldigs</string>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async presonalAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Developer Notification',
      subHeader: 'Social Media Presences',
      message: 'In construction, links will be provided once available. Please use <strong>d.langelihlekhumalo@gmail.com</strong>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

}
