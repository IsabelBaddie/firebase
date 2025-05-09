import { Injectable } from '@angular/core';
import { collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { PosturaI } from '../models/postura.models';
import { Firestore } from 'firebase/firestore';
import { Dificultad, RoutineI } from '../models/routine.models';
import { PosturaRutinaI } from '../models/posturarutina.models';

@Injectable({
  providedIn: 'root'
})
export class RutinasService {

  constructor(private firestore: Firestore) { }

  async crearRutinasPorDefectoParaUsuario(usuarioId: string) {
    //definimos las categorias de las posturas que queremos para cada rutina
    const fuerzaCategorias = [2, 6]; // Para rutinas de fuerza: 2, 6
    const flexibilidadCategorias = [3, 4, 5, 8]; // Para rutinas de flexibilidad: 3, 4, 5, 8
    const relajacionCategorias = [1, 7, 9]; // Para rutinas de relajación: 1, 7, 9


    const coleccionPosturas = collection(this.firestore, 'posturas'); //obtenemos la referencia a la colección de posturas
    const querySnapshot = await getDocs(coleccionPosturas); //realizamos una consulta a la colección de posturas
    const posturas = querySnapshot.docs.map(doc => doc.data() as PosturaI); //mapeamos los documentos a un array de posturasI

    // Filtramos las posturas según las categorías definidas para constuir las rutinas luego 
    const posturasFuerza = posturas.filter(postura => fuerzaCategorias.includes(postura.categoria_id)); //vemos si esa postura tiene esa categoria
    const posturasFlexibilidad = posturas.filter(postura => flexibilidadCategorias.includes(postura.categoria_id));
    const posturasRelajacion = posturas.filter(postura => relajacionCategorias.includes(postura.categoria_id));

    // Definimos las rutinas por defecto con sus respectivas posturas y tipos
    const rutinas = [
      { nombre: "Rutina de Fuerza", posturas: posturasFuerza, tipo: "fuerza", dificultad: Dificultad.Dificil },
      { nombre: "Rutina de Flexibilidad", posturas: posturasFlexibilidad, tipo: "flexibilidad", dificultad: Dificultad.Media },
      { nombre: "Rutina de Relajación", posturas: posturasRelajacion, tipo: "relajación", dificultad: Dificultad.Facil },
    ];

    const coleccionRutinas = collection(this.firestore, 'rutinas'); //referencia a la colección de rutinas
    const coleccionPosturaRutina = collection(this.firestore, 'posturarutina'); //referencia a la colección de postura-rutina

    for (const rutina of rutinas) { //por cada rutina que hemos definidos como constante 
      const rutinaId = `${usuarioId}_${rutina.tipo}`;
      const rutinasDocRef = doc(coleccionRutinas, rutinaId);

      const rutinaData: RoutineI = {
        id: rutinaId,
        nombre: rutina.nombre,
        dificultad: rutina.dificultad,
        duracion: rutina.posturas.reduce((acc, p) => acc + p.duracion, 0),
        puntuacion: null,
        numeroValoraciones: null,
        media: null,
        fechaCreacion: new Date(),
        tipo: null
      };

      await setDoc(rutinasDocRef, rutinaData);  // 🔸 Guardamos la rutina en Firestore

      // AHORA CREAMOS LOS DOCUMENTOS EN LA COLECCIÓN INTERMEDIA posturarutina
      for (const postura of rutina.posturas) {
        const posturaRutinaId = `${rutinaId}_${postura.id}`;
        const posturaRutinaDocRef = doc(coleccionPosturaRutina, posturaRutinaId); 
        //referencia al documento dentro de la colección posturarutina usando ese ID. Así puedes guardar la relación entre esa rutina y esa postura específica.

        const posturaRutinaData: PosturaRutinaI = {
          id: posturaRutinaId,
          postura_id: postura.id,
          rutina_id: rutinaId
        };

        await setDoc(posturaRutinaDocRef, posturaRutinaData); // 🔸 Guardamos la relación entre postura y rutina en Firestore
      }

    } 
  }

}
