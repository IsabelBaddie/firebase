import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonInput,
  IonCard, IonButton, IonSpinner, IonIcon, IonButtons, IonCardHeader, IonCardTitle, IonCardContent, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
//añado: 

import { FirestoreService } from '../common/services/firestore.service';
import { RoutineI } from '../common/models/routine.models';
import { PosturaI } from '../common/models/postura.models';
import { PosturaRutinaService } from '../common/services/posturarutina.service';
import { CategoriasService } from '../common/services/categorias.service';
import { AutenticacionService } from '../common/services/autenticacion.service';
import { RutinausuarioService } from '../common/services/rutinausuario.service';  // Importa el servicio de rutinausuario
import { RutinasService } from '../common/services/rutinas.service';

import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

import { Storage } from '@ionic/storage-angular'; //para el almacenamiento de datos en el dispositivo

import { Timestamp } from 'firebase/firestore';
import { ComentarioModalComponent } from '../comentario-modal/comentario-modal.component';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ComentarioI } from '../common/models/comentario.models';

@Component({
  selector: 'app-routine',
  standalone: true,
  templateUrl: 'routine.page.html',
  styleUrls: ['routine.page.scss'],
  providers: [PosturaRutinaService, CategoriasService],
imports: [
      IonicModule, // <- esto te da acceso a servicios como ModalController
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComentarioModalComponent,
],

})

export class RoutinePage implements OnInit {
  //VARIABLES DEL COMPONENTE
  rutinas: RoutineI[] = [];
  nuevaRutina: RoutineI;
  cargando: boolean = false;
  private storage: Storage;
  usuarioActivo: any = null; // Variable para almacenar el usuario activo

  // Nuevos para manejar posturas
  selectedPosturas: PosturaI[] = [];
  //rutinaSeleccionadaId: string = '';
  rutinaSeleccionada: any = null;
  rutinaSeleccionadaId: string = '';  // Aquí se guardará el ID de la rutina seleccionada


  todasLasPosturas: PosturaI[] = [];
  posturasSeleccionadasId: { [key: string]: string } = {}; // inicializa el objeto vacío

  rutina: any;
  categorias: any[] = [];

  todasLasRutinas: RoutineI[] = [];
  rutinaAAsignarId: string = '';

  posturasPorCategoria: { [categoriaId: string]: PosturaI[] } = {}; // Diccionario para guardar resultados por categoría
  categoriaSeleccionadaId: string | null = null;
  categoriasExpandida: { [categoriaId: string]: boolean } = {};

  private modalActual: HTMLIonModalElement | null = null;



  constructor(
    private firestoreService: FirestoreService,
    private posturaRutinaService: PosturaRutinaService,
    private firestore: Firestore,
    private autenticacionService: AutenticacionService,
    private categoriasService: CategoriasService
    , private rutinausuarioService: RutinausuarioService // Inyecta el servicio de rutinausuario
    , private rutinaService: RutinasService,
    private modalController: ModalController

  ) {
    addIcons({ create: icons['create'], trash: icons['trash'] });
    this.initRoutine();
    this.cargarRutinas();
    this.initStorage();  // Inicializa Storage

    // this.mostrarDatosUsuario(); // Muestra los datos del usuario al cargar el componente
  }

  async initStorage() {
    this.storage = await new Storage();
    await this.storage.create();
    await this.loadUser();
  }

  async ngOnInit() {
    this.cargarTodasLasPosturas();
    await this.cargarCategorias(); // Espera a que se carguen
    await this.cargarTodasLasPosturasPorCategoria(); // Luego carga las posturas por categoría
    this.todasLasRutinas = await this.rutinaService.getTodasLasRutinas(); // O el método que uses
  }


  cargarRutinas() {
    this.firestoreService.getCollectionChanges<RoutineI>('Rutinas').subscribe(data => {
      if (data) {
        this.rutinas = data;
      }
    });
  }

  initRoutine() {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0]; // "2025-05-08"
    console.log("fechaFormateada", fechaFormateada);

    this.nuevaRutina = {

      id: this.firestoreService.createIdDoc(),
      nombre: null,
      dificultad: null,
      duracion: null,
      puntuacion: null,
      numeroValoraciones: null,
      media: null,
      fechaCreacion: new Date(fechaFormateada),
      tipo: null
    };
  }

  async saveRoutine() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.nuevaRutina, 'Rutinas', this.nuevaRutina.id);
    this.cargando = false;
    this.initRoutine();
    this.cargarRutinas();
  }

  async deleteRoutine(routine: RoutineI) {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Rutinas', routine.id);
    this.cargando = false;
    this.cargarRutinas();
  }

  editarRutina(routine: RoutineI) {
    console.log("Editando rutina -> ", routine);
    this.nuevaRutina = routine;
  }


  async showPosturas(rutinaId: string) {
    this.rutinaSeleccionada = this.rutinas.find(r => r.id === rutinaId);
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
    console.log('Posturas con categoría_id:', this.todasLasPosturas.map(p => p.categoria_id));

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

  async cargarCategorias(): Promise<void> {
    try {
      this.categorias = await this.categoriasService.getTodasCategorias();
      console.log('Categorías cargadas:', this.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
    console.log('IDs de categorías:', this.categorias.map(c => c.id));

  }


  async cargarTodasLasPosturasPorCategoria() {
    for (const categoria of this.categorias) {
      const posturas = await this.categoriasService.getPosturasDeCategoria(categoria.id);
      this.posturasPorCategoria[categoria.id] = posturas;
      console.log(`Posturas de la categoría ${categoria.nombre}:`, posturas);
    }
  }

  async togglePosturasCategoria(categoriaId: string) {
    // Si ya está expandida, la colapsamos
    if (this.categoriasExpandida[categoriaId]) {
      this.categoriasExpandida[categoriaId] = false;
      return;
    }

    // Si no tiene posturas cargadas, las pedimos
    if (!this.posturasPorCategoria[categoriaId]) {
      try {
        const posturas = await this.categoriasService.getPosturasDeCategoria(categoriaId);
        this.posturasPorCategoria[categoriaId] = posturas;
      } catch (error) {
        console.error('Error al cargar posturas de la categoría:', error);
      }
    }

    // Expandimos la categoría
    this.categoriasExpandida[categoriaId] = true;
  }


  // Cargar usuario activo desde el almacenamiento o Firebase
async loadUser() {
  this.autenticacionService.onAuthStateChanged(async (user) => {
    if (user) {
      const datos = await this.autenticacionService.obtenerDatosUsuario();
      this.usuarioActivo = datos;
      await this.storage.set('usuarioActivo', datos);
      await this.cargarRutinasUsuario();  // Cargar rutinas del usuario una vez esté autenticado
    } else {
      console.log('No hay usuario autenticado');
      this.usuarioActivo = null;
      await this.storage.remove('usuarioActivo');
    }
  });
}


  // Cargar las rutinas asociadas al usuario
  async cargarRutinasUsuario() {
    if (this.usuarioActivo) {
      this.rutinas = await this.rutinausuarioService.getRutinasDeUsuario(this.usuarioActivo.id);
      console.log('Rutinas del usuario cargadas:', this.rutinas);
    }
  }

  // Asignar una nueva rutina al usuario
  async asignarRutina(rutinaId: string) {
    if (this.usuarioActivo) {
      await this.rutinausuarioService.asignarRutinaAUsuario(this.usuarioActivo.id, rutinaId);
      this.cargarRutinasUsuario(); // Recargar las rutinas del usuario
    }
  }


 async abrirModalComentario(rutinaId: string) {
  this.rutinaSeleccionadaId = rutinaId;  // Guardamos el ID de la rutina seleccionada

  const modal = await this.modalController.create({
    component: ComentarioModalComponent,
  });

  await modal.present();

  // Escuchar cuando el modal se cierre y capturar el contenido del comentario
  modal.onWillDismiss().then(async (result) => {
    if (result.data) {
      const comentarioContenido = result.data.contenido;
      if (comentarioContenido) {
        // Si hay un contenido de comentario, se guarda
        await this.guardarComentario(comentarioContenido);
      }
    }
  });
}


async guardarComentario(contenido: string) {
  // Verificar si el usuario está autenticado
  if (!this.usuarioActivo.id) {
    console.error('No hay usuario autenticado o UID no disponible');
    return;
  }

  const comentario: ComentarioI = {
    id: this.firestoreService.createIdDoc(),  // Generamos un ID único para el comentario
    contenido: contenido,
    fechaPublicacion: new Timestamp(Date.now() / 1000, 0),  // Fecha actual en formato Timestamp de Firebase
    usuario_id: this.usuarioActivo.id,  // Usamos el UID del usuario autenticado
    rutina_id: this.rutinaSeleccionadaId  // Rutina asociada al comentario
  };

  try {
    // Guardamos el comentario en la colección 'Comentarios'
    await this.firestoreService.createDocumentID(comentario, 'comentarios', comentario.id);
    console.log('Comentario guardado:', comentario);
  } catch (error) {
    console.error('Error al guardar el comentario en Firestore:', error);
  }
}



}
