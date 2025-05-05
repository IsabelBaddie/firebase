import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PosturasService } from './posturas.service';
import { CategoriasService } from './categorias.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private posturasService = inject(PosturasService);
  private categoriaService = inject(CategoriasService); 

  constructor() {
    this.posturasService.addPosturas();
    this.categoriaService.addCategorias(); 
  }
}
