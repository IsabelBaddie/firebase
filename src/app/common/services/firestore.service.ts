import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore } from '@angular/fire/firestore';
import { DocumentReference, getDoc, setDoc } from 'firebase/firestore';
//libreria para generar id aleatorios : 
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs'; //permite observables 

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore); //injectar 
  constructor() { }

  getDocument<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace) as DocumentReference<tipo, any>; 
    return getDoc<tipo, any>(document)
  }

  //nuestro crud

  //leemos coleccion, método de tipo generico 
  getCollectionChanges<tipo>(path: string): Observable<tipo[]> { //recibe como parametro el tipo de dato (en este caso UserI),
    //  el argumento path que es la la ruta/el nombre de la coleccion 

    const refcollection = collection(this.firestore, path); //recibe la biblioteca/libreria y la ruta 


    return collectionData(refcollection)  as Observable<tipo[]>; //nos devuelve un observable y le pasamos una referencia a la coleccion 
    //return collectionData(refcollection ) as Observable<tipo>; ASÍ LO TIENE ÉL Y SIN EL : Observable<tipo[]> 
  }

  createDocument(data: any, enlace: string) {
    const document = doc(this.firestore, enlace); 
    return setDoc(document, data); 
  }

  createDocumentID(data: any, enlace: string, idDoc: string) { //el enlace es el nombre de la coleccion y se concatena con el id del documento
    const document = doc(this.firestore, `${enlace}/${idDoc}`); 
    return setDoc(document,data); 
  }

  createIdDoc() {
    return uuidv4() //llamamos a la funcion de la libreria 
  }
}
