import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { UserI } from '../common/models/user.models';
import { FirestoreService } from '../common/services/firestore.service';
//para que funcione ngModel 
import { FormsModule } from '@angular/forms';
//para los iconos

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonLabel, 
    FormsModule
  ],
})
export class HomePage {

  //Se declara una propiedad users, que es un array de objetos del tipo UserI.
  users: UserI[] = []; //inicializamos en vacio, de un modelo/interfaz que hemos creado 

  //nos creamos un nuevo usuario
  newUser: UserI;
  cargando: boolean = false; 

  constructor(private firestoreService: FirestoreService) { //le pasamos el servicio 
    this.loadusers(); //Al crear el componente, se ejecuta loadusers() para cargar los datos desde Firestore.
    this.initUser(); 
     //añadimos iconos
     addIcons ({create: icons['create']}); 
     addIcons ({trash: icons['trash']}); 
  }

 
  

  loadusers() {
    //utilizamos el metodo del servicio 
    /*getCollectionChanges<UserI>('Usuarios') devuelve un Observable<UserI[]>.
    .subscribe(data => {...}) escucha los cambios en tiempo real.
    Cuando hay datos, el observable emite un array de objetos UserI, y eso es lo que recibe el parámetro data
    */
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe( data => { 

      //función 
      if (data) { //Si hay datos los guardamos en users
         this.users = data
      }

    })

  }

  initUser() {
    this.newUser = {
      nombre:null,
      edad: null,
      id: this.firestoreService.createIdDoc() //llamamos al servicio para que nos genere un id aleatorio por la libreria 
    }
  }

  async save() {
    this.cargando = true; 
    await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id)
    this.cargando = false; 
  }

    //para crear un documento necesitas la información a ser guardada (datos) y donde va a ser guardada (enlace)


  
}
