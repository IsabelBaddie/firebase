import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { UserI } from '../common/models/user.models'; // Importamos nuestro modelo UserI (interfaz para un usuario)
import { FirestoreService } from '../common/services/firestore.service'; // Servicio personalizado para trabajar con Firestore
import { AutenticacionService } from '../common/services/autenticacion.service';
//para que funcione ngModel en los inputs
import { FormsModule } from '@angular/forms';
//para los iconos
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

//para el almacenamiento de datos en el dispositivo
import { Storage } from '@ionic/storage-angular';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonLabel,
    FormsModule, CommonModule
  ],
})
export class HomePage {

  private storage: Storage;

  async initStorage() {
    this.storage = await new Storage().create();
  }

  //VARIABLES DEL COMPONENTE 

  //Atributo users, que es un array de objetos del tipo UserI.
  users: UserI[] = []; //Inicializamos en vacio, de un modelo/interfaz que hemos creado, se va rellenando con Firebase

  newUser: UserI;   // Objeto que usamos para el formulario de crear/editar usuarios

  cargando: boolean = false;  // Bandera para mostrar un spinner de carga (true/false)

  usuarioActual: any; // Variable para almacenar el usuario activo


  login = {
    email: '',
    password: ''
  };


  constructor(private firestoreService: FirestoreService, private router: Router,) { // Constructor: se inyecta el servicio FirestoreService
    this.loadusers(); //Al crear el componente (es decir la pagina), se ejecuta loadusers() para cargar los usuarios desde Firestore.
    this.initUser(); // Inicializamos un usuario vacío para el formulario

    //añadimos iconos personalizados
    addIcons({ create: icons['create'] });
    addIcons({ trash: icons['trash'] });

    this.initStorage(); // <--- importante
  }

  loadusers() {  // Método que escucha cambios en la colección 'Usuarios' en Firestore
    //utilizamos el metodo del servicio 
    /*getCollectionChanges<UserI>('Usuarios') devuelve un Observable<UserI[]>.
    .subscribe(data => {...}) escucha los cambios en tiempo real.
    Cuando hay datos, el observable emite un array de objetos UserI, y eso es lo que recibe el parámetro data
    */
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe(data => {

      //FUNCIÓN
      if (data) { // Actualizamos la lista de usuarios si Firestore nos devuelve datos
        this.users = data
      }

    })

  }

  initUser() {
    this.newUser = {
      id: this.firestoreService.createIdDoc(),
      nombre: null,
      email: '',
      password: ''
    }
  }

  async save() { // Método para guardar (crear) un nuevo usuario en Firestore
    this.cargando = true; // Activamos el spinner 
    await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id)
    this.cargando = false; // Desactivamos el spinner
    this.initUser(); // Limpiamos el formulario para crear uno nuevo y que no se sobreescriba 
    /*
    initUser() genera un nuevo id y pone los campos nombre y edad en null.
    Así los inputs de tu formulario también se limpian (porque están ligados con [(ngModel)] a newUser).
    */
  }

  //para crear un documento necesitas la información a ser guardada (datos) y donde va a ser guardada (enlace)


  edit(user: UserI) { // Método para cargar datos de un usuario en el formulario (para editar)
    console.log("Editando -> ", user)
    this.newUser = user; // Copiamos los datos al formulario  
  }

  async delete(user: UserI) { // Método para borrar un usuario
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Usuarios', user.id);
    this.cargando = false;
  }

  async goToRoutine() {
    // Verificar si el usuario está logueado
    const usuarioId = await this.storage.get('usuarioActivo');

    if (usuarioId) {
      // Si está logueado, redirigir a la página de rutinas
      console.log('Usuario logueado, redirigiendo...');
      this.router.navigate(['/routine']);
    } else {
      // Si no está logueado, redirigir al login o mostrar un mensaje
      console.log('Usuario no logueado, redirigiendo al login...');
      this.router.navigate(['/login']);  // Redirige a la página de login
    }
  }


  autenticacion = inject(AutenticacionService); //inyectamos el servicio de autenticacion

  /* FUNCIONAMIENTO CORRECTO, SIN EL STORAGE: 
   submit() {
    const { email, password } = this.login;
  
    if (email && password) {
      this.autenticacion.signIn(email, password)
        .then(res => {
          console.log('Login exitoso:', res);
          
        })
        .catch(err => {
          console.error('Error en login:', err);
        });
    } else {
      console.warn('Por favor completa el email y la contraseña.');
    }
  }*/
  async inicio() {
    const { email, password } = this.login;

    if (email && password) {
      try {
        const res = await this.autenticacion.signIn(email, password);
        console.log('Login exitoso:', res);

        // Guardar el UID o email del usuario
        await this.storage.set('usuarioActivo', res.user.uid);
        console.log('Usuario almacenado en Storage con este uid:', res.user.uid);

          const datos = await this.autenticacion.obtenerDatosUsuario();
          this.usuarioActual = datos; 
          

      } catch (err) {
        console.error('Error en login:', err);
      }
    } else {
      console.warn('Por favor completa el email y la contraseña.');
    }
  }


  /*FUNCIONAMIENTO CORRECTO, SIN EL STORAGE:
  logout() {
    this.autenticacion.logout()
      .then(() => {
        console.log('Sesión cerrada correctamente');
      })
      .catch(err => {
        console.error('Error al cerrar sesión:', err);
      });
  }*/

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


  async registerAndSave() {
    const { email, password, nombre } = this.newUser;

    if (email && password && nombre) {
      try {
        // 1. Registrar en Firebase Auth
        const cred = await this.autenticacion.register({ email, password });

        // 2. Guardar en Firestore (usando el ID generado o el UID del auth)
        this.newUser.id = cred.user.uid; // usa el UID del auth como ID único
        await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id);

        console.log('Usuario registrado y guardado correctamente.');
        this.initUser();

      } catch (err) {
        console.error('Error al registrar:', err);
      }
    } else {
      console.warn('Completa todos los campos antes de registrar.');
    }
  }


}

