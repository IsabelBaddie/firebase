import { collection, addDoc,   query, where,  getDocs,  doc,  getDoc } from 'firebase/firestore';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { PosturaRutinaI } from '../models/posturarutina.models';
import { PosturaI } from '../models/postura.models';


export class PosturaRutinaService {
  private firestore = inject(Firestore);

  addPosturaRutina(data: Omit<PosturaRutinaI, 'id'>) {
    const colRef = collection(this.firestore, 'posturaRutina');
    return addDoc(colRef, data);
  }

  async getPosturasDeRutina(rutinaId: string): Promise<PosturaI[]> {
    const relacionesRef = collection(this.firestore, 'posturaRutina');
    const q = query(relacionesRef, where('rutina_id', '==', rutinaId));
    const snapshot = await getDocs(q);

    const posturas: PosturaI[] = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as PosturaRutinaI;
      const posturaRef = doc(this.firestore, 'posturas', data.postura_id);
      const posturaSnap = await getDoc(posturaRef);
      if (posturaSnap.exists()) {
        posturas.push({ id: posturaSnap.id, ...posturaSnap.data() } as PosturaI);
      }
    }
    return posturas;
  }
}





