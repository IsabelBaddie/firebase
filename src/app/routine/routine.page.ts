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
  selectedPosturas: PosturaI[] = [];
  //rutinaSeleccionadaId: string = '';
  rutinaSeleccionada: any = null;

  todasLasPosturas: PosturaI[] = [];
  posturasSeleccionadasId: { [key: string]: string } = {}; // inicializa el objeto vacío

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

  /*showPosturas(rutina: RoutineI) {
    this.rutinaSeleccionada = rutina;
    this.posturaRutinaService.getPosturasDeRutina(rutina.id)
      .then(posturas => this.selectedPosturas = posturas)
      .catch(err => console.error('Error al obtener posturas', err));
  }*/
      async showPosturas(rutinaId: string) {
        this.rutinaSeleccionada = this.routines.find(r => r.id === rutinaId);
        if (!this.rutinaSeleccionada) {
          console.error('No se encontró la rutina con ID:', rutinaId);
          return;
        }
      
        // Mostrar posturas de esa rutina
        try {
          this.selectedPosturas = await this.posturaRutinaService.getPosturasDeRutina(rutinaId);
          console.log('Posturas asociadas a la rutina:', this.selectedPosturas);
        } catch (error) {
          console.error('Error al obtener las posturas:', error);
        }
      }
      

      async cargarTodasLasPosturas() {
        const colRef = collection(this.firestore, 'posturas');
        const snapshot = await getDocs(colRef);
        this.todasLasPosturas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PosturaI[];
      
        console.log('Posturas cargadas:', this.todasLasPosturas);
      }
      

  async asociarPostura(rutinaId: string) {
    const posturaId = this.posturasSeleccionadasId[rutinaId];
    if (!posturaId) return;

    await this.posturaRutinaService.addPosturaARutina(rutinaId, posturaId);
    this.posturasSeleccionadasId[rutinaId] = ''; // Resetea el valor después de asociar
    this.showPosturas(rutinaId); // Refresca la lista de posturas asociadas
  }

  onPosturaChange(rutinaId: string) {
    console.log('Postura seleccionada para rutina ' + rutinaId, this.posturasSeleccionadasId[rutinaId]);
  }
  
}
