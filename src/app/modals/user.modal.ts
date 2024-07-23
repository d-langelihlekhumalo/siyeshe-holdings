/* eslint-disable no-underscore-dangle */
export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date
  ) {}

  get token(){
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    // in reverse => current time in milliseconds - token expiration in millisecons
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
