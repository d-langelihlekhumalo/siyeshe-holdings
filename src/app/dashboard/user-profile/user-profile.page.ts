import { map, switchMap, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDataModal } from '../../modals/user-data.modal';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userId: string;
  users: UserDataModal[] = [];
  currentUser: UserDataModal;
  loggedInUserEmail: string;
  isShowPassword = false;

  constructor(
    private authService: AuthService,
    private fireAuth: AngularFireAuth) { }

  ngOnInit() {

    this.authService.fetchUsers().subscribe();
    this.loggedInUserEmail = this.authService.loggedInUserEmail;

    this.authService.users.subscribe(userData => {
      this.users = userData;
      Object.values(this.users).forEach(user => {
        if (user.email === this.loggedInUserEmail) {
          // this.currentUser = new Array(user.name, user.surname, user.username, user.email, user.password);
          this.currentUser = user;
        }
      });
    });

  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  sendEmailVerificationMessage() {

  }

}
