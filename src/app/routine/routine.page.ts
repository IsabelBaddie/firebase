import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput, IonCard, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';

import { FirestoreService } from '../common/services/firestore.service';
import { RoutineI } from '../common/models/routine.models';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';


@Component({
  selector: 'app-routine',
  standalone: true,              // ← ojo aquí
  templateUrl: 'routine.page.html',
  styleUrls: ['routine.page.scss'],
  imports: [
    IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    FormsModule,  CommonModule,                // ← importa CommonModule
  ],
})
export class RoutinePage {

  routines: RoutineI[] = [];
  newRoutine: RoutineI;
  cargando: boolean = false;

  constructor(private firestoreService: FirestoreService) {
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
      nombreRutina: null,
      descripcion: null,
      duracion: null
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



}