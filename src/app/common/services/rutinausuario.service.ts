import { Injectable } from '@angular/core';
// 🔁 CORRECTO
import { Firestore, collection, doc, getDoc, getDocs, query, where, addDoc } from '@angular/fire/firestore';

import { RoutineI } from '../models/routine.models';

import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RutinausuarioService {

  constructor(private firestore: Firestore) {}

  // Obtener las rutinas asociadas a un usuario
  async getRutinasDeUsuario(usuarioId: string): Promise<RoutineI[]> {
    const relacionesRef = collection(this.firestore, 'rutinausuario');
    const q = query(relacionesRef, where('usuario_id', '==', usuarioId));
    const relacionesSnapshot = await getDocs(q);

    const rutinas: RoutineI[] = [];

    for (const relacionDoc of relacionesSnapshot.docs) {
      const { rutina_id } = relacionDoc.data();

      if (rutina_id) {
        const rutinaRef = doc(this.firestore, 'Rutinas', rutina_id);
        const rutinaSnap = await getDoc(rutinaRef);

        if (rutinaSnap.exists()) {
          const rutinaData = rutinaSnap.data() as Omit<RoutineI, 'id'>;
          rutinas.push({ ...rutinaData, id: rutinaSnap.id });
        }
      }
    }

    return rutinas;
  }

  // Asignar una rutina a un usuario
  async asignarRutinaAUsuario(usuarioId: string, rutinaId: string): Promise<void> {
    const relacionesRef = collection(this.firestore, 'rutinausuario');
    await addDoc(relacionesRef, {
      usuario_id: usuarioId,
      rutina_id: rutinaId,
      fechaAsignacion: Timestamp.now()
    });
  }
}


