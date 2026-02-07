
import { FoodItem, ExerciseType } from './types';

export const FOOD_DATABASE: FoodItem[] = [
  { name: 'Napolitana de Chocolate', cal: 420, p: 6, c: 45, f: 24, unit: 'unidad' },
  { name: 'Napolitana de Crema', cal: 380, p: 5, c: 48, f: 20, unit: 'unidad' },
  { name: 'Cruasán (Croissant)', cal: 280, p: 5, c: 30, f: 16, unit: 'unidad' },
  { name: 'Cruasán con chocolate', cal: 350, p: 6, c: 38, f: 21, unit: 'unidad' },
  { name: 'Rosquilla / Donut', cal: 250, p: 3, c: 31, f: 12, unit: 'unidad' },
  { name: 'Palmera de Chocolate', cal: 450, p: 5, c: 55, f: 25, unit: 'unidad' },
  { name: 'Chorizo', cal: 450, p: 24, c: 2, f: 38, unit: '100g' },
  { name: 'Salchichón', cal: 400, p: 26, c: 1, f: 32, unit: '100g' },
  { name: 'Lomo Embuchado', cal: 210, p: 38, c: 1, f: 6, unit: '100g' },
  { name: 'Jamón Serrano', cal: 240, p: 30, c: 0, f: 13, unit: '100g' },
  { name: 'Mortadela', cal: 310, p: 12, c: 2, f: 28, unit: '100g' },
  { name: 'Lentejas con verduras', cal: 116, p: 9, c: 20, f: 0.4, unit: '100g' },
  { name: 'Arroz Blanco', cal: 130, p: 2.7, c: 28, f: 0.3, unit: '100g' },
  { name: 'Arroz con Pollo', cal: 150, p: 8, c: 22, f: 3, unit: '100g' },
  { name: 'Pechuga de Pollo', cal: 165, p: 31, c: 0, f: 3.6, unit: '100g' },
  { name: 'Plátano', cal: 89, p: 1.1, c: 23, f: 0.3, unit: '100g' },
  { name: 'Manzana', cal: 52, p: 0.3, c: 14, f: 0.2, unit: '100g' },
  { name: 'Huevo Cocido', cal: 155, p: 13, c: 1.1, f: 11, unit: '100g' },
  { name: 'Avena', cal: 389, p: 16.9, c: 66, f: 6.9, unit: '100g' }
];

export const EXERCISE_METS: ExerciseType[] = [
  { id: 'walking', name: 'Caminar', met: 3.5 },
  { id: 'running', name: 'Correr', met: 8.8 },
  { id: 'cycling', name: 'Ciclismo', met: 7.5 },
  { id: 'swimming', name: 'Natación', met: 8.0 },
  { id: 'weightlifting', name: 'Gimnasio / Pesas', met: 5.0 },
  { id: 'soccer', name: 'Fútbol', met: 9.0 },
  { id: 'dancing', name: 'Baile', met: 5.0 },
  { id: 'martial_arts', name: 'Artes Marciales', met: 10.0 }
];

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentario' },
  { value: 1.375, label: 'Ligero (1-3 días)' },
  { value: 1.55, label: 'Moderado (3-5 días)' },
  { value: 1.725, label: 'Intenso (6-7 días)' },
  { value: 1.9, label: 'Élite (Atleta)' }
];
