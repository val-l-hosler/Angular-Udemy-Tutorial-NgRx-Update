export class User {
  // it needs to be private bc the token should not be retrievable like this, you want to do it in a way that the validity is auto checked
  constructor(public email: string, public id: string, private _token: string, private _tokenExpirationDate: Date) {
  }

  // can access this like a property (user.token)
  // runs when it's called
  // a user can't override this
  get token() {
    return (!this._tokenExpirationDate || this._tokenExpirationDate < new Date()) ? null : this._token;
  }
}
