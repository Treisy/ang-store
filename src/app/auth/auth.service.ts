import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if(user) {
        return this.afs.doc<User>(`users/${user.userId}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(credentials => {
        this.router.navigate(['/shop']);
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailAndPassword(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email.value, password.value);
  }
}
