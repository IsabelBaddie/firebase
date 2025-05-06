import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

import { FirestoreService } from '../common/services/firestore.service';
import { RoutineI } from '../common/models/routine.models';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

//añadido nuevo: 
import { PosturaI } from '../common/models/postura.models';
import { PosturaRutinaService } from '../common/services/posturarutina.service'; //FIN AÑADIDO NUEVO



@Component({
  selector: 'app-routine',
  standalone: true,              // ← ojo aquí
  templateUrl: 'routine.page.html',
  styleUrls: ['routine.page.scss'],
  providers: [PosturaRutinaService],  // Aquí es donde se provee el servicio a nivel del componente
  imports: [IonCardContent, IonCardTitle, IonCardHeader, 
    IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    FormsModule,  CommonModule,                
  ],
})
export class RoutinePage {

  routines: RoutineI[] = [];
  newRoutine: RoutineI;
  cargando: boolean = false;

  //añadido nuevo: 
  selectedPosturas: PosturaI[] = [];
  rutinaSeleccionadaId: string = '';
  rutina: any;
  //fin añadido nuevo 

  constructor(
    private firestoreService: FirestoreService,
    private posturaRutinaService: PosturaRutinaService
  ) {
    this.loadRoutines();
    this.initRoutine();
  
    addIcons({ create: icons['create'] });
    addIcons({ trash: icons['trash'] });
  }
  

  loadRoutines() {
    this.firestoreService.getCollectionChanges<RoutineI>('Rutinas').subscribe(data => {
      if (data) {
        this.routines = data;
      }
    });
  }

  initRoutine() {
    this.newRoutine = {
      id: this.firestoreService.createIdDoc(),
      nombre: null,
      dificultad: null,
      duracion: null,
      puntuacion: null,
      numeroValoraciones: null,
      media: null,
      //COMENTARIO
      fechaCreacion: null,
      vecesUsada: null,
    };
  }

  async saveRoutine() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newRoutine, 'Rutinas', this.newRoutine.id);
    this.cargando = false;
    this.initRoutine();
    this.loadRoutines(); // 🔥 recargar rutinas después de guardar
  }
  
  async deleteRoutine(routine: RoutineI) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Rutinas', routine.id);
    this.cargando = false;
    this.loadRoutines(); // 🔥 recargar rutinas después de borrar
  }
  

  editRoutine(routine: RoutineI) {
    console.log("Editando rutina -> ", routine);
    this.newRoutine = routine;
  }

  //AÑADIDO NUEVO: metodo para cargar las posturas de una rutina 
 /* async showPosturas(rutinaId: string) {
    this.selectedPosturas = await this.posturaRutinaService.getPosturasDeRutina(rutinaId);
    console.log("Posturas asociadas:", this.selectedPosturas);
  }*/
    async showPosturas(rutinaId: string) {
      this.rutinaSeleccionadaId = rutinaId;
      this.selectedPosturas = await this.posturaRutinaService.getPosturasDeRutina(rutinaId);

      if (this.selectedPosturas.length === 0) {
        console.log(`La rutina con ID ${rutinaId} no tiene posturas asociadas.`);
      } else {
        console.log(`Posturas de la rutina ${rutinaId}:`, this.selectedPosturas);
      }

    }
    
  



}