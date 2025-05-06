import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput,
  IonCard, IonButton, IonSpinner, IonIcon, IonButtons, IonCardHeader, IonCardTitle, IonCardContent, IonSelectOption
} from '@ionic/angular/standalone';
//añado: 


import { FirestoreService } from '../common/services/firestore.service';
import { RoutineI } from '../common/models/routine.models';
import { PosturaI } from '../common/models/postura.models';
import { PosturaRutinaService } from '../common/services/posturarutina.service';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-routine',
  standalone: true,
  templateUrl: 'routine.page.html',
  styleUrls: ['routine.page.scss'],
  providers: [PosturaRutinaService],
  imports: [
    IonCardContent, IonCardTitle, IonCardHeader,
    IonButtons, IonIcon, IonSpinner, IonButton, IonCard, IonInput, IonList, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    FormsModule, CommonModule, IonSelectOption, ReactiveFormsModule
  ],
})

export class RoutinePage implements OnInit {
  routines: RoutineI[] = [];
  newRoutine: RoutineI;
  cargando: boolean = false;

  // Nuevos para manejar posturas
  rutinaSeleccionadaId: string | null = null;
  posturaSeleccionadaId: { [key: string]: string } = {};
  selectedPosturas: any[] = [];
  
 
  todasLasPosturas: PosturaI[] = [];
    // Para almacenar el ID de postura seleccionada por rutina
rutina: any;

  constructor(
    private firestoreService: FirestoreService,
    private posturaRutinaService: PosturaRutinaService,
    private firestore: Firestore
  ) {
    addIcons({ create: icons['create'], trash: icons['trash'] });
    this.initRoutine();
    this.loadRoutines();
  }

  ngOnInit() {
    this.cargarTodasLasPosturas();
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
      fechaCreacion: null,
      vecesUsada: null,
    };
  }

  async saveRoutine() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newRoutine, 'Rutinas', this.newRoutine.id);
    this.cargando = false;
    this.initRoutine();
    this.loadRoutines();
  }

  async deleteRoutine(routine: RoutineI) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Rutinas', routine.id);
    this.cargando = false;
    this.loadRoutines();
  }

  editRoutine(routine: RoutineI) {
    console.log("Editando rutina -> ", routine);
    this.newRoutine = routine;
  }

  async showPosturas(rutinaId: string) {
    this.rutinaSeleccionadaId = rutinaId;
    this.selectedPosturas = await this.posturaRutinaService.getPosturasDeRutina(rutinaId);

    if (this.selectedPosturas.length === 0) {
      console.log(`La rutina con ID ${rutinaId} no tiene posturas asociadas.`);
    } else {
      console.log(`Posturas de la rutina ${rutinaId}:`, this.selectedPosturas);
    }
  }

  async cargarTodasLasPosturas() {
    const colRef = collection(this.firestore, 'posturas');
    const snapshot = await getDocs(colRef);
    this.todasLasPosturas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PosturaI[];
  }

  async asociarPostura(rutinaId: string) {
    const posturaId = this.posturaSeleccionadaId[rutinaId];
    if (!posturaId) return;

    await this.posturaRutinaService.addPosturaARutina(rutinaId, posturaId);
    this.posturaSeleccionadaId[rutinaId] = ''; // Resetea el valor después de asociar
    this.showPosturas(rutinaId); // Refresca la lista de posturas asociadas
  }
}

/*export class RoutinePage implements OnInit {

  routines: RoutineI[] = [];
  newRoutine: RoutineI;
  cargando: boolean = false;

  // Nuevos para manejar posturas
  selectedPosturas: PosturaI[] = [];
  rutinaSeleccionadaId: string = '';
  todasLasPosturas: PosturaI[] = [];
  posturaSeleccionadaId: { [rutinaId: string]: string } = {};

  constructor(
    private firestoreService: FirestoreService,
    private posturaRutinaService: PosturaRutinaService,
    private firestore: Firestore
  ) {
    addIcons({ create: icons['create'], trash: icons['trash'] });
    this.initRoutine();
    this.loadRoutines();
  }

  ngOnInit() {
    this.cargarTodasLasPosturas();
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
      fechaCreacion: null,
      vecesUsada: null,
    };
  }

  async saveRoutine() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newRoutine, 'Rutinas', this.newRoutine.id);
    this.cargando = false;
    this.initRoutine();
    this.loadRoutines();
  }

  async deleteRoutine(routine: RoutineI) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Rutinas', routine.id);
    this.cargando = false;
    this.loadRoutines();
  }

  editRoutine(routine: RoutineI) {
    console.log("Editando rutina -> ", routine);
    this.newRoutine = routine;
  }

  async showPosturas(rutinaId: string) {
    this.rutinaSeleccionadaId = rutinaId;
    this.selectedPosturas = await this.posturaRutinaService.getPosturasDeRutina(rutinaId);

    if (this.selectedPosturas.length === 0) {
      console.log(`La rutina con ID ${rutinaId} no tiene posturas asociadas.`);
    } else {
      console.log(`Posturas de la rutina ${rutinaId}:`, this.selectedPosturas);
    }
  }

  async cargarTodasLasPosturas() {
    const colRef = collection(this.firestore, 'posturas');
    const snapshot = await getDocs(colRef);
    this.todasLasPosturas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PosturaI[];
  }

  async asociarPostura(rutinaId: string) {
    const posturaId = this.posturaSeleccionadaId[rutinaId];
    if (!posturaId) return;

    await this.posturaRutinaService.addPosturaARutina(rutinaId, posturaId);
    this.posturaSeleccionadaId[rutinaId] = '';
    this.showPosturas(rutinaId); // refresca lista
  }

}*/
