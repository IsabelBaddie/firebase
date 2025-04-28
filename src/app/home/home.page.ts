import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { UserI } from '../common/models/user.models'; // Importamos nuestro modelo UserI (interfaz para un usuario)
import { FirestoreService } from '../common/services/firestore.service'; // Servicio personalizado para trabajar con Firestore
//para que funcione ngModel en los inputs
import { FormsModule } from '@angular/forms';
//para los iconos
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons'; 
import { User } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonLabel, 
    FormsModule
  ],
})
export class HomePage {

  //VARIABLES DEL COMPONENTE 

  //Atributo users, que es un array de objetos del tipo UserI.
  users: UserI[] = []; //Inicializamos en vacio, de un modelo/interfaz que hemos creado, se va rellenando con Firebase

  newUser: UserI;   // Objeto que usamos para el formulario de crear/editar usuarios

  cargando: boolean = false;  // Bandera para mostrar un spinner de carga (true/false)

  constructor(private firestoreService: FirestoreService, private router: Router) { // Constructor: se inyecta el servicio FirestoreService
    this.loadusers(); //Al crear el componente (es decir la pagina), se ejecuta loadusers() para cargar los usuarios desde Firestore.
    this.initUser(); // Inicializamos un usuario vacío para el formulario

     //añadimos iconos personalizados
     addIcons ({create: icons['create']}); 
     addIcons ({trash: icons['trash']}); 
  }


  loadusers() {  // Método que escucha cambios en la colección 'Usuarios' en Firestore
    //utilizamos el metodo del servicio 
    /*getCollectionChanges<UserI>('Usuarios') devuelve un Observable<UserI[]>.
    .subscribe(data => {...}) escucha los cambios en tiempo real.
    Cuando hay datos, el observable emite un array de objetos UserI, y eso es lo que recibe el parámetro data
    */
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe( data => { 

      //FUNCIÓN
      if (data) { // Actualizamos la lista de usuarios si Firestore nos devuelve datos
         this.users = data 
      }

    })

  }

  initUser() {
        // Inicializamos un usuario vacío para limpiar el formulario
    this.newUser = {
      nombre:null,
      edad: null,
      id: this.firestoreService.createIdDoc() //llamamos al servicio para que nos genere un id aleatorio por la libreria para el nuevo usuario 
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
      console.log("Editando -> " , user)
      this.newUser = user; // Copiamos los datos al formulario  
    }

    async delete (user: UserI) { // Método para borrar un usuario
      this.cargando = true; 
      await this.firestoreService.deleteDocumentID('Usuarios' , user.id); 
      this.cargando = false; 
    }

    goToRoutine() {
      this.router.navigate(['/routine']);
    }



  
}
