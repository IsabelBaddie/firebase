import { Injectable } from '@angular/core';
import {addDoc, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { RoutineI } from "../models/routine.models"; // Ajusta la ruta según tu estructura
import { Firestore, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RutinausuarioService {

  constructor(private firestore:Firestore) { }

  async getRutinasDeUsuario(usuarioId: string): Promise<RoutineI[]> {
    const relacionesRef = collection(this.firestore, 'rutinaUsuario');
    const q = query(relacionesRef, where('usuario_id', '==', usuarioId));
    const relacionesSnapshot = await getDocs(q);
  
    const rutinas: RoutineI[] = [];
  
    for (const relacionDoc of relacionesSnapshot.docs) {
      const { rutina_id } = relacionDoc.data();
  
      if (rutina_id) {
        const rutinaRef = doc(this.firestore, 'rutinas', rutina_id);
        const rutinaSnap = await getDoc(rutinaRef);
  
        if (rutinaSnap.exists()) {
          const rutinaData = rutinaSnap.data() as Omit<RoutineI, 'id'>;
          rutinas.push({ ...rutinaData, id: rutinaSnap.id });
        }
      }
    }
  
    return rutinas;
  }

  
async asignarRutinaAUsuario(usuarioId: string, rutinaId: string): Promise<void> {
  const relacionesRef = collection(this.firestore, 'rutinausuario');

  await addDoc(relacionesRef, {
    usuario_id: usuarioId,
    rutina_id: rutinaId,
    fechaAsignacion: Timestamp.now()
  });
}
}
