export enum Nombre {
  Equilibrio = "Asanas de equilibrio de pie",
  Anterior = "Asanas de flexión anterior",
  Posterior = "Asanas de flexión posterior",
  Invertidas = "Asanas invertidas",
  Tronco = "Asanas de equilibrio de brazos/core", 
  Apertura = "Asanas de apertura de caderas", 
  Meditacion = "Asanas de meditación", 
}

export interface CategoriaI {
    id: string;
    nombre: Nombre;
    beneficios: string[];         
    contraindicaciones: string[]; 
  
  }
  