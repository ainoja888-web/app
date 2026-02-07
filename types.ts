
export interface Profile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: number;
  goal: 'loss' | 'maintenance' | 'gain';
}

export interface FoodItem {
  name: string;
  cal: number;
  p: number;
  c: number;
  f: number;
  unit: string;
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

export interface ExerciseType {
  id: string;
  name: string;
  met: number;
}

export interface LoggedExercise {
  id: string;
  typeId: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  timestamp: number;
}

export interface MacroTotals {
  targetCalories: number;
  consumed: {
    cal: number;
    prot: number;
    carb: number;
    fat: number;
  };
  burnedExtra: number;
  remaining: number;
}
