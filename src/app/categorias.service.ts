import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { CategoriaI } from '../app/common/models/categoria.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  constructor(private firestore: Firestore) {}

  async addCategorias() {
    const categorias: CategoriaI[] = [
      {
        "id": "1", 
        "nombre": "ASANAS  DE PIE (Standing asanas)",
        "beneficios": [
            "Efecto de anclarse a la tierra",
            "Fortalecen los músculos y articulaciones de las piernas",
            "Mejoran la postura",
            "Fortalecen el core (abdomen)",
            "Ayudan a perder peso corporal",
            "Son una buena preparación para el resto de asanas"
        ],
        "contraindicaciones": [
            "Lesiones en tobillos, piernas o rodillas",
            "Practicar con precaución si se tiene hiperflexibilidad, sobrepeso, enfermedades cardíacas o vértigo"
        ],
        "ejemplos_posturas": [
            "Utthita Trikonasana",
            "Virabhadrasana I",
            "Virabhadrasana II",
            "Utkatasana",
            "Parsvotanasana"
        ]
    },
    {
        "id": "2",
        "nombre": "ASANAS DE EQUILIBRIO DE PIE (Standing balance asanas)",
        "beneficios": [
            "Mejoran la concentración",
            "Favorecen el equilibrio",
            "Fortalecen piernas, tobillos y core (abdomen)"
        ],
        "contraindicaciones": [
            "Lesiones en tobillos, piernas o rodillas",
            "Practicar con precaución si se tiene hiperflexibilidad, sobrepeso, presión sanguínea extremadamente alta o baja, vértigo o si está embarazada."
        ],
        "ejemplos_posturas": [
            "Vrksasana",
            "Virabhadrasana III",
            "Ardha Chandrasana",
            "Ardha Baddha Padma Vrksasana",
            "Garudasana",
            "Natarajasana"
        ]
    },
    {
        "id": "3",
        "nombre": "ASANAS DE FLEXIÓN ANTERIOR (Forward bending asanas)",
        "beneficios": [
            "Estiran la espalda",
            "Relajan el torso",
            "Calman la mente y el sistema nervioso",
            "Bajan nuestra presión sanguínea",
            "Buenas para estreñimiento y el sistema digestivo en general",
            "Nos ayudan a 'mirar hacia dentro', hacia nosotros mismos",
            "Nos ayudan a 'soltar' y dejar ir"
        ],
        "contraindicaciones": [
            "Embarazo, glaucoma, enfermedades cardíacas, presión sanguínea extremadamente baja."
        ],
        "ejemplos_posturas": [
            "Uttanasana",
            "Balasana",
            "Paschimottanasana",
            "Janu Sirsasana"
        ]
    },
    {
        "id": "4",
        "nombre": "ASANAS DE FLEXIÓN POSTERIOR (Backbending asanas)",
        "beneficios": [
            "Abren el pecho y aumentan la capacidad pulmonar",
            "Mejoran la postura corporal",
            "Aumentan la circulación sanguínea en abdomen y pelvis",
            "Estiran músculos del abdomen y pelvis",
            "Estiran psoas ilíaco y cuadriceps",
            "Buenas para estreñimiento y para el dolor de espalda",
            "Aconsejables para prevenir el dolor menstrual y para menstruaciones irregulares",
            "Recomendadas para gente que pasa mucho tiempo sentada"
        ],
        "contraindicaciones": [
            "Hernias, lesiones de espalda, hiperlordosis, embarazo, enfermedades cardíacas."
        ],
        "ejemplos_posturas": [
            "Hasta Uttanasana",
            "Camatkarasana",
            "Purvottanasana",
            "Bhujangasana",
            "Salabhasana",
            "Ustrasana",
            "Ardha ustrasana",
            "Chakrasana o Urdhva Danurasana",
            "Urdhva Mukha Svanasana",
            "Supta Virasana",
            "Matsyasana"
        ]
    },
    {
        "id": "5",
        "nombre": "ASANAS INVERTIDAS (inversions)",
        "beneficios": [
            "Aumentan circulación sanguínea",
            "Son energizantes, activan nuestro cuerpo",
            "Ayudan al sistema linfático",
            "Fortalecen brazos, espalda, core (abdomen) y hombros",
            "Buenas para estreñimiento",
            "Favorecen el sistema inmunológico",
            "Recomendables para la tiroides, especialmente: Halasana y Salamba Sarvangasana"
        ],
        "contraindicaciones": [
            "Embarazo, glaucoma, enfermedades cardíacas, presión sanguínea alta, lesiones en cuello o espalda.",
            "No se recomienda realizar posiciones invertidas durante la menstruación, ya que invertimos el flujo natural de la sangre."
        ],
        "ejemplos_posturas": [
            "Adho Mukha Svanasana",
            "Halasana",
            "Salamba sarvangasana",
            "Sirsasana"
        ]
    },
    {
        "id": "6",
        "nombre": "ASANAS DE EQUILIBRIO DE BRAZOS Y ABDOMEN (arms/core balance asanas)",
        "beneficios": [
            "Fortalecen brazos y abdomen",
            "Favorecen el equilibrio y la concentración",
            "Ayudan a perder peso corporal"
        ],
        "contraindicaciones": [
            "Lesiones de muñeca, hombros o codos.",
            "Practicar con precaución si tienes problemas cardíacos o si estás embarazada (especialmente al final del embarazo)"
        ],
        "ejemplos_posturas": [
            "Chaturanga dandasana",
            "Navasana",
            "Vasisthasana",
            "Kakasana",
            "Bakasana"
        ]
    },
    {
        "id": "7",
        "nombre": "ASANAS DE TORSIÓN (twists)",
        "beneficios": [
            "Masajean y activan los órganos internos",
            "Ayudan a desintoxicar tu cuerpo",
            "Estimulan el sistema digestivo",
            "Algunas pueden tener efecto calmante y relajante",
            "Ayudan poner la columna neutral tras realizar backbendings (flexiones posteriores del cuerpo)"
        ],
        "contraindicaciones": [
            "Lesiones o dolor en el abdomen",
            "Lesiones de espalda.",
            "Practicar con precaución si estás embarazada, haz las torsiones desde el pecho solamente."
        ],
        "ejemplos_posturas": [
            "Parivrtta Trikonasana",
            "Parivrtta Baddha Parsvakonasana",
            "Ardha Matsyendrasana",
            "Marichyasana",
            "Baradvajasana"
        ]
    },
    {
        "id": "8",
        "nombre": "ASANAS DE APERTURA DE CADERAS (Hip openers)",
        "beneficios": [
            "Liberan tensión y tristeza",
            "Aumentan la amplitud de movimiento",
            "Se pueden realizar durante el embarazo"
        ],
        "contraindicaciones": [
            "Compresión en la articulación de la cadera, operaciones de cadera."
        ],
        "ejemplos_posturas": [
            "Skandasana",
            "Malasana",
            "Utkata Konasana",
            "Gomukasana",
            "Baddha konasana",
            "Kapotasana",
            "Utkatakonasana"
        ]
    },
    {
        "id": "9",
        "nombre": "ASANAS DE MEDITACIÓN (Meditation asanas)",
        "beneficios": [
            "Mejoran la concentración",
            "Mantienen nuestra columna vertebral recta"
        ],
        "contraindicaciones": [
            "Lesiones de rodillas o tobillos."
        ],
        "ejemplos_posturas": [
            "Padmasana",
            "Ardha Padmasana",
            "Siddha Yoni asana o Siddhasana",
            "Sukhasana",
            "Vajrasana"]
        }   
      // ... las demás categorías
    ];

    const categoriasCollection = collection(this.firestore, 'categorias');

    try {
      for (const categoria of categorias) {
        const newDocRef = doc(categoriasCollection, categoria.id); // Usamos el ID de la categoría

        await setDoc(newDocRef, {
          id: categoria.id,
          nombre: categoria.nombre,
          beneficios: categoria.beneficios,
          contraindicaciones: categoria.contraindicaciones,
          ejemplos_posturas: categoria.ejemplos_posturas // Asegúrate de incluir este campo
        });
      }
    } catch (error) {
      console.error("Error al insertar las categorías en Firestore", error);
    }
  }
}
