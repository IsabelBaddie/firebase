import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem,
  IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

import { UserI } from '../common/models/user.models';
import { FirestoreService } from '../common/services/firestore.service';
import { AutenticacionService } from '../common/services/autenticacion.service';

//añadido para intenar arreglar: 
import { IonicStorageModule } from '@ionic/storage-angular'; // Importamos IonicStorageModule

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput,
    IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, FormsModule, IonicStorageModule, // Añadido para el almacenamiento
  ],
})
export class HomePage implements OnInit {

  private storage = inject(Storage); // ✅ forma correcta
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private auth = inject(Auth);
  private autenticacion = inject(AutenticacionService);

  users: UserI[] = [];
  newUser: UserI;
  cargando = false;

  login = {
    email: '',
    password: ''
  };

  usuarioActivo: any = null;

  ngOnInit() {
    this.loadUsers();
    this.initUser();

    addIcons({ create: icons['create'], trash: icons['trash'] });
  }

  initUser() {
    this.newUser = {
      id: this.firestoreService.createIdDoc(),
      nombre: null,
      email: '',
      password: ''
    };
  }

  loadUsers() {
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe(data => {
      if (data) this.users = data;
    });
  }

  async save() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id);
    this.cargando = false;
    this.initUser();
  }

  edit(user: UserI) {
    this.newUser = user;
  }

  async delete(user: UserI) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Usuarios', user.id);
    this.cargando = false;
  }

  async inicio() {
    const { email, password } = this.login;
    if (!email || !password) return console.warn('Completa email y contraseña.');

    try {
      const res = await this.autenticacion.signIn(email, password);
      await this.storage.set('usuarioActivo', res.user.uid);
      console.log('Login exitoso y guardado:', res.user.uid);
    } catch (err) {
      console.error('Error en login:', err);
    }
  }

  async logout() {
    try {
      await this.autenticacion.logout();
      await this.storage.remove('usuarioActivo');
      this.router.navigate(['/home']);
      console.log('Sesión cerrada correctamente');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }

  async goToRoutine() {
    const usuarioId = await this.storage.get('usuarioActivo');
    if (usuarioId) {
      this.router.navigate(['/routine']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /*async getUserDetails(uid: string) {
    const userDetails = await this.autenticacion.getUserDetails(uid);  // Aquí usamos el servicio para obtener los detalles
    if (userDetails) {
      await this.storage.set('usuarioActivo', userDetails);
      this.usuarioActivo = userDetails;
      console.log('Usuario cargado desde Firestore:', userDetails);
    } else {
      console.warn('No se encontraron detalles del usuario.');
    }
  }*/
  

  async registerAndSave() {
    const { email, password, nombre } = this.newUser;
    if (!email || !password || !nombre) {
      return console.warn('Completa todos los campos');
    }

    try {
      const cred = await this.autenticacion.register({ email, password });
      this.newUser.id = cred.user.uid;
      await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id);
      console.log('Usuario registrado y guardado.');
      this.initUser();
    } catch (err) {
      console.error('Error al registrar:', err);
    }
  }
}
