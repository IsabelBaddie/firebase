import { Component, OnInit } from '@angular/core';
import { IonContent, IonInput, IonItem, IonLabel } from "@ionic/angular";  // Importa desde @ionic/angular (no standalone)
import { ModalController, IonicModule } from '@ionic/angular'; 
import { Input } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Para usar ngModel

@Component({
  standalone: true,
  imports: [
    IonicModule,  // Importa IonicModule para tener todos los componentes de Ionic
    FormsModule    // Asegúrate de importar FormsModule para usar ngModel
  ],
  selector: 'app-comentario-modal',
  templateUrl: './comentario-modal.component.html',
  styleUrls: ['./comentario-modal.component.scss'],
})
export class ComentarioModalComponent implements OnInit {

  @Input() rutina: { nombre: string };
  public contenido: string = '';  

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async cerrarModalYGuardarComentario() {
    await this.modalController.dismiss({
      contenido: this.contenido,// pasa el contenido del comentario 
    });
  }
}

