import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserI } from '../common/models/user.models';
import { Auth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceTsService {
  private auth: Auth = inject(Auth);

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
