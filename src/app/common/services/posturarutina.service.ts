import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { PosturaRutinaI } from '../models/posturarutina.models';
import { PosturaI } from '../models/postura.models';

@Injectable({
  providedIn: 'root'
})
export class PosturaRutinaService {
  private firestore = inject(Firestore);

  //Este método agrega una relación entre una rutina y una postura. es async, lo que significa que usa await internamente y devuelve una promesa.
  async addPosturaARutina(rutinaId: string, posturaId: string) {
    const coleccionPosturaRutina = collection(this.firestore, 'posturarutina'); //función que obtiene la colección 
    //insertamos un documento en esa colección coleccionPosturaRutina metiendo en los campos rutina_id y postura_id los parametros recibidos. 
    return addDoc(coleccionPosturaRutina, { //al addDoc debemos pasarle la coleccion y data que son los datos del documento
      rutina_id: rutinaId,
      postura_id: posturaId,
    });
  }

  //Método que busca todas las posturas asociadas a una rutina específica. Retorna una promesa que se resuelve con un array de PosturaI.
  async getPosturasDeRutina(rutinaId: string): Promise<PosturaI[]> {
    console.log("entra en getPosturasDeRutina");
    const coleccionPosturaRutina = collection(this.firestore, 'posturarutina'); //obtenemos una colección
    const consultaQuery = query(coleccionPosturaRutina, where('rutina_id', '==', rutinaId)); //realizamos una consulta donde rutina_id del documento sea igual al parametro pasado
    const instantanea = await getDocs(consultaQuery); //realizamos una consulta que nos devuelve una instantanea con los documentos que coinciden 
  

    const posturas: PosturaI[] = []; //array de posturas vacío 
    
    for (const documentoInstantanea of instantanea.docs) { //vamos recorriendo todos los documentos de la instantanea 
      const data = documentoInstantanea.data() as PosturaRutinaI; //casteamos los datos como la interfaz 
      const documentopostura = doc(this.firestore, 'posturas', data.postura_id); //obtenemos el documento postura con el postura_id
      const posturaSnap = await getDoc(documentopostura); //leemos los datos de esa postura 
      if (posturaSnap.exists()) { //si hay datos 
        posturas.push({ id: posturaSnap.id, ...posturaSnap.data() } as PosturaI); //añadimos al array de posturas
      }
    }
    return posturas;
  }

   //Método que busca todas las posturas asociadas a una rutina específica. Retorna una promesa que se resuelve con un array de PosturaI.
   async getPosturasDeCategoria(categoriaId: string): Promise<PosturaI[]> {
    console.log("entra en getPosturasDeCategoria");
    const coleccionPosturas = collection(this.firestore, 'posturas'); //obtenemos una colección
    const consultaQuery = query(coleccionPosturas, where('categoria_id', '==', categoriaId)); //realizamos una consulta donde rutina_id del documento sea igual al parametro pasado
    const instantanea = await getDocs(consultaQuery); //realizamos una consulta que nos devuelve una instantanea con los documentos que coinciden 
  

    const posturasPorCategoria: PosturaI[] = []; //array de posturas vacío 
    
    for (const documentoInstantanea of instantanea.docs) { //vamos recorriendo todos los documentos de la instantanea 
      const data = documentoInstantanea.data() as PosturaI; //casteamos los datos como la interfaz 
      posturasPorCategoria.push(data); //añadimos al array de posturas  
    }
    return posturasPorCategoria;
  }

  
}





