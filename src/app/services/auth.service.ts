/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserDataModal } from '../modals/user-data.modal';
import { User } from '../modals/user.modal';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface UserData {
  // userId: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private _users = new BehaviorSubject<UserDataModal[]>([]);
  private activeLogoutTimer: any;
  private _loggedInUserEmail: string;

  constructor(private http: HttpClient) { }

  get userIsAthuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
       return !!user.token;
      } else {
        return false;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  get users() {
    return this._users.asObservable();
  }

  get loggedInUserEmail() {
    return this._loggedInUserEmail;
  }

  setLoggedInUserEmail(email: string) {
    this._loggedInUserEmail = email;
  }

  autoLogin() {
    // From is imported from rxjs, it takes a promise, listens to it and converts it into an observable :)
    // Use use the map operator to convert returned authData to usable data must ultimately return boolean
    return from(Storage.get({key: 'authData'})).pipe(map(storedData => {
      if (!storedData || !storedData.value) { //!storedData.value
        return null;
      }

      const parsedData = JSON.parse(storedData.value) as {token: string; tokenExpirationDate: string; userId: string; email: string};
      const expirationTime = new Date(parsedData.tokenExpirationDate);
      if (expirationTime <= new Date()) {
        return null; // expired
      }

      const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
      return user;
    }), tap(user => {
      if (user) {
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }), map(user => !!user));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {email, password, returnSecureToken: true}).pipe(tap(this.setUserData.bind(this)));
  }

  addUser(name: string, surname: string, username: string, email: string, password: string) {
    let generatedId: string;
    let newUser: UserDataModal;

    // eslint-disable-next-line prefer-const
     newUser = new UserDataModal(
      '',
      name,
      surname,
      username,
      email,
      password
    );

    return this.http
      .post<{name: string}>('https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/users.json',
      {... newUser, userId: null}).pipe(switchMap(responseData => {
        generatedId = responseData.name;
        return this._users;
      }), take(1),
      tap(users => {
        newUser.userId = generatedId;
        this._users.next(users.concat(newUser));
      }));
  }

  fetchUsers() {
    return this.http
    .get<{[key: string]: UserDataModal}>('https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/users.json')
    .pipe(map(responseData => {
      const users = [];
      for(const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          users.push(
            new UserDataModal(
              key,
              responseData[key].name,
              responseData[key].surname,
              responseData[key].username,
              responseData[key].email,
              responseData[key].password,
            ));
          }
        }
        return users;
    }), tap(users => {
      this._users.next(users);
    }));
  }

  getUser(userId: string) {
    console.log('User ID:',userId);
    return this.http
      .get<UserData>(`https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/users/${userId}.json`)
      .pipe(
        map(userData => new UserDataModal(
          userId,
          userData.name,
          userData.surname,
          userData.username,
          userData.email,
          userData.password
        ))
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
    {email, password, returnSecureToken: true}).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    console.log('Logging out');
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    // Only remove data with key === authData
    Storage.remove({key: 'authData'});
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    // Store data to local storage::capacitor?
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExirationDate: string, email: string) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExirationDate,
      email
    });
    Storage.set({key: 'authData', value: data});
  }
}
