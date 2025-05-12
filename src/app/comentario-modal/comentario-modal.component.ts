import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';  // Importa IonicModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule para usar ngModel

@Component({
  standalone: true,
  imports: [
    IonicModule,  // Asegúrate de que IonicModule esté aquí
    FormsModule    // Asegúrate de que FormsModule esté aquí para usar ngModel
  ],
  selector: 'app-comentario-modal',
  templateUrl: './comentario-modal.component.html',
  styleUrls: ['./comentario-modal.component.scss'],
})
export class ComentarioModalComponent implements OnInit {

  public contenido: string = '';  // Contenido del comentario

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async cerrarModal() {
    await this.modalController.dismiss({
      contenido: this.contenido  // Pasar el contenido al cerrar el modal
    });
  }
}
