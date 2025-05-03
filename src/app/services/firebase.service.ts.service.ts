import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceTsService {
  private auth: Auth = inject(Auth);

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
