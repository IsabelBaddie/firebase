import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { FirestoreService } from '../services/firestore.service'; // Importamos el FirestoreService
import { Storage } from '@ionic/storage-angular'; // Importamos Storage
import { UserI } from '../models/user.models'; // Importamos UserI

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService, // Inyectamos el FirestoreService
    private storage: Storage // Inyectamos Storage
  ) {}

  // Método de registro
  register(user: { email: string; password: string }) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  // Método de inicio de sesión
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método de cierre de sesión
  logout() {
    return signOut(this.auth);
  }

  // Método para obtener los detalles del usuario desde Firestore
  async getUserDetails(uid: string) {
    try {
      // Llamamos al FirestoreService para obtener los detalles del usuario
      const userDetails = await this.firestoreService.getDocument<UserI>(`usuarios/${uid}`); // Uso de FirestoreService

      if (userDetails) {
        // Guardamos los detalles del usuario en Storage
        await this.storage.set('usuarioActivo', userDetails);
        console.log('Usuario cargado desde Firestore:', userDetails);
        return userDetails;
      } else {
        console.warn('No se encontraron detalles del usuario.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      return null;
    }
  }

  // Verificar si hay un usuario autenticado
  onAuthStateChanged(callback: (user: UserI | null) => void) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const userI: UserI = {
          id: user.uid,
          nombre: user.displayName || '',
          email: user.email || '', // Recuperamos el email del objeto de usuario de Firebase
          password: '', // Firebase no proporciona la contraseña
        };
        callback(userI);
      } else {
        callback(null);
      }
    });
  }
}
