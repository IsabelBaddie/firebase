import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase (reemplázalo con tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyCHqtj-RVy1ECogl8vt2-HljsSYoHV2E84",
  authDomain: "pruebafirebase-app.firebaseapp.com",
  projectId: "pruebafirebase-app",
  storageBucket: "pruebafirebase-app.firebasestorage.app",
  messagingSenderId: "263973053466",
  appId: "1:263973053466:web:273b3a777f510972131da3"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enum de Dificultad
export enum Dificultad {
  Facil = "fácil",
  Media = "media",
  Dificil = "difícil"
}

// Interfaz de Postura
export interface PosturaI {
  id: string;
  imagen_url: string;
  postura: string;
  video_url: string;
  duracion: number;
  dificultad: Dificultad;
}

// Datos de las posturas (en un ejemplo)
const posturas: PosturaI[] = [
  {
    id: '', // El id se asigna automáticamente por Firestore
    imagen_url: "https://www.theclassyoga.com/wp-content/uploads/2024/03/tadasana-samasthiti.jpg",
    postura: "Tadasana o Samasthiti – Postura de la montaña",
    video_url: "https://www.youtube.com/watch?v=27wklcKtPuw",
    duracion: 1,
    dificultad: Dificultad.Facil
  },
  {
    id: '', // El id se asigna automáticamente por Firestore
    imagen_url: "https://www.theclassyoga.com/wp-content/uploads/2024/03/urdhva-hastasana-mano-arriba.jpg",
    postura: "Urdhva Hastasana – Postura de mano hacia arriba",
    video_url: "https://www.youtube.com/watch?v=6JCj40FKdVk",
    duracion: 1,
    dificultad: Dificultad.Facil
  },
  // Añadir el resto de las posturas de manera similar...
];

// Función para agregar las posturas a Firestore
async function addPosturas() {
  const posturasCollection = collection(db, 'posturas');  // Reemplaza con el nombre de tu colección

  try {
    for (const postura of posturas) {
      // Añadir la postura a Firestore
      const docRef = await addDoc(posturasCollection, {
        imagen_url: postura.imagen_url,
        postura: postura.postura,
        video_url: postura.video_url,
        duracion: postura.duracion,
        dificultad: postura.dificultad
      });

      console.log(`Postura añadida con ID: ${docRef.id}`);
    }
    console.log("Todas las posturas se han añadido correctamente.");
  } catch (error) {
    console.error("Error al añadir las posturas: ", error);
  }
}

// Llamamos a la función para agregar las posturas
addPosturas();
