
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, Star, Plus, Trash2, Info, Search, BookOpen, Utensils, 
  Clock, Lightbulb, User, Settings, PieChart, ChefHat, Dumbbell,
  Target, TrendingUp, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

import { 
  Profile, LoggedMeal, LoggedExercise, MacroTotals, FoodItem, ExerciseType 
} from './types';
import { 
  FOOD_DATABASE, EXERCISE_METS, ACTIVITY_LEVELS 
} from './constants';
import { ProgressCircle } from './components/ProgressCircle';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  // --- Persistent State ---
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('elite_profile');
    return saved ? JSON.parse(saved) : {
      weight: 75,
      height: 180,
      age: 28,
      gender: 'male',
      activityLevel: 1.55,
      goal: 'maintenance'
    };
  });

  const [meals, setMeals] = useState<LoggedMeal[]>(() => {
    const saved = localStorage.getItem('elite_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [exercises, setExercises] = useState<LoggedExercise[]>(() => {
    const saved = localStorage.getItem('elite_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  // --- UI State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEx, setSearchEx] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(1);
  const [exDuration, setExDuration] = useState(30);
  // Fixed syntax error in generic type definition for selectedEx to prevent arithmetic operation errors
  const [selectedEx, setSelectedEx] = useState<ExerciseType | null>(null);

  useEffect(() => {
    localStorage.setItem('elite_profile', JSON.stringify(profile));
    localStorage.setItem('elite_meals', JSON.stringify(meals));
    localStorage.setItem('elite_exercises', JSON.stringify(exercises));
  }, [profile, meals, exercises]);

  // --- Calculations ---
  const totals = useMemo<MacroTotals>(() => {
    const { weight, height, age, gender, activityLevel, goal } = profile;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    let targetCalories = bmr * activityLevel;
    if (goal === 'loss') targetCalories -= 500;
    if (goal === 'gain') targetCalories += 500;

    const consumed = meals.reduce((acc, item) => ({
      cal: acc.cal + item.calories,
      prot: acc.prot + item.protein,
      carb: acc.carb + item.carbs,
      fat: acc.fat + item.fats
    }), { cal: 0, prot: 0, carb: 0, fat: 0 });

    const burnedExtra = exercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0);

    return {
      targetCalories,
      consumed,
      burnedExtra,
      remaining: targetCalories + burnedExtra - consumed.cal
    };
  }, [profile, meals, exercises]);

  // --- Handlers ---
  const handleProfileUpdate = (field: keyof Profile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addMeal = () => {
    if (!selectedFood) return;
    const factor = selectedFood.unit === '100g' ? qty / 100 : qty;
    const newMeal: LoggedMeal = {
      id: Date.now().toString(),
      name: `${selectedFood.name} (${qty} ${selectedFood.unit})`,
      calories: Math.round(selectedFood.cal * factor),
      protein: Number((selectedFood.p * factor).toFixed(1)),
      carbs: Number((selectedFood.c * factor).toFixed(1)),
      fats: Number((selectedFood.f * factor).toFixed(1)),
      timestamp: Date.now()
    };
    setMeals(prev => [newMeal, ...prev]);
    setSelectedFood(null);
    setSearchTerm('');
  };

  const addExercise = () => {
    if (!selectedEx) return;
    const caloriesBurned = Math.round(selectedEx.met * 0.0175 * profile.weight * exDuration);
    const newEx: LoggedExercise = {
      id: Date.now().toString(),
      typeId: selectedEx.id,
      name: selectedEx.name,
      duration: exDuration,
      caloriesBurned,
      timestamp: Date.now()
    };
    setExercises(prev => [newEx, ...prev]);
    setSelectedEx(null);
    setSearchEx('');
  };

  const deleteMeal = (id: string) => setMeals(prev => prev.filter(m => m.id !== id));
  const deleteEx = (id: string) => setExercises(prev => prev.filter(e => e.id !== id));

  const macroData = [
    { name: 'Protein', value: totals.consumed.prot, target: 150, color: '#c5a059' },
    { name: 'Carbs', value: totals.consumed.carb, target: 250, color: '#e2e8f0' },
    { name: 'Fats', value: totals.consumed.fat, target: 70, color: '#4b5563' },
  ];

  const userContextString = `Weight: ${profile.weight}kg, Goal: ${profile.goal}, Consumed: ${Math.round(totals.consumed.cal)}kcal, Remaining: ${Math.round(totals.remaining)}kcal.`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 selection:bg-[#c5a059] selection:text-black">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c5a059] rounded-full blur-[160px]" />
        <div className="absolute bottom-48 right-0 w-80 h-80 bg-slate-800 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 animate-fade-in">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#c5a059] p-2 rounded-xl">
                <Star size={24} fill="black" className="text-black" />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                NutriBalance <span className="text-[#c5a059]">Elite</span>
              </h1>
            </div>
            <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px]">Level Up Your Physiological Potential</p>
          </div>

          <div className="flex bg-[#141414] p-1.5 rounded-2xl border border-[#222] shadow-2xl">
            {['male', 'female'].map(g => (
              <button 
                key={g}
                onClick={() => handleProfileUpdate('gender', g as 'male' | 'female')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${profile.gender === g ? 'bg-[#c5a059] text-black shadow-lg shadow-yellow-900/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Profile */}
            <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] p-8 space-y-8 shadow-xl">
              <h2 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                <Settings size={14} /> Profile Configuration
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Current Weight</span>
                    <span className="text-white text-sm">{profile.weight} kg</span>
                  </div>
                  <input 
                    type="range" min="40" max="150" value={profile.weight}
                    onChange={(e) => handleProfileUpdate('weight', Number(e.target.value))}
                    className="w-full h-1 bg-black rounded-full accent-[#c5a059] appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Height</span>
                    <span className="text-white text-sm">{profile.height} cm</span>
                  </div>
                  <input 
                    type="range" min="140" max="220" value={profile.height}
                    onChange={(e) => handleProfileUpdate('height', Number(e.target.value))}
                    className="w-full h-1 bg-black rounded-full accent-[#c5a059] appearance-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Age</label>
                    <input 
                      type="number" value={profile.age}
                      onChange={(e) => handleProfileUpdate('age', Number(e.target.value))}
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-sm focus:border-[#c5a059] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Goal</label>
                    <select 
                      value={profile.goal}
                      onChange={(e) => handleProfileUpdate('goal', e.target.value)}
                      className="w-full bg-black border border-[#222] rounded-xl px-4 py-2 text-sm focus:border-[#c5a059] outline-none"
                    >
                      <option value="loss">Weight Loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="gain">Bulk</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Loggers */}
            <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                  <ChefHat size={14} /> Nutrition Logger
                </h2>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-3.5 text-slate-600" />
                <input 
                  type="text" placeholder="Search database..." 
                  className="w-full bg-black border border-[#222] rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-[#c5a059] outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((food, i) => (
                  <button 
                    key={i} 
                    onClick={() => {setSelectedFood(food); setQty(1);}}
                    className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-2xl border border-transparent hover:border-[#c5a059]/30 transition-all group"
                  >
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{food.name}</span>
                    <Plus size={14} className="text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              {/* Training Logger */}
              <div className="pt-6 border-t border-[#222]">
                <h2 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                  <Dumbbell size={14} /> Training Logger
                </h2>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {EXERCISE_METS.map((ex, i) => (
                    <button 
                      key={i}
                      onClick={() => {setSelectedEx(ex); setExDuration(30);}}
                      className="p-3 bg-black border border-[#222] rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modals for Entry */}
            {selectedFood && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
                <div className="bg-[#c5a059] text-black p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">{selectedFood.name}</h3>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-8 tracking-widest">Entry Strategy</p>
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase">Quantity ({selectedFood.unit})</label>
                       <input 
                         type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))}
                         className="w-full py-4 bg-black/10 rounded-2xl text-3xl font-black text-center border-none outline-none"
                       />
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setSelectedFood(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-black/20 rounded-2xl">Cancel</button>
                        <button onClick={addMeal} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-black text-white rounded-2xl shadow-xl">Record Entry</button>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {selectedEx && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
                <div className="bg-white text-black p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">{selectedEx.name}</h3>
                   <p className="text-[10px] font-black uppercase opacity-60 mb-8 tracking-widest">Training Session</p>
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase">Duration (Minutes)</label>
                       <input 
                         type="number" value={exDuration} onChange={(e) => setExDuration(Number(e.target.value))}
                         className="w-full py-4 bg-slate-100 rounded-2xl text-3xl font-black text-center border-none outline-none"
                       />
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setSelectedEx(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-slate-200 rounded-2xl">Cancel</button>
                        <button onClick={addExercise} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-[#c5a059] text-black rounded-2xl shadow-xl">Record Training</button>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dashboard & Charts */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-xl">
                 <ProgressCircle current={totals.consumed.cal} total={totals.targetCalories + totals.burnedExtra} label="Daily Intake" />
              </div>
              <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] p-8 space-y-6 shadow-xl flex flex-col justify-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">TDEE Strategy</p>
                  <p className="text-3xl font-black italic tracking-tighter">{Math.round(totals.targetCalories)} <span className="text-xs text-[#c5a059] not-italic">BASE</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059]">Training Bonus</p>
                  <p className="text-3xl font-black italic tracking-tighter text-[#c5a059]">+{Math.round(totals.burnedExtra)} <span className="text-xs text-slate-500 not-italic">INC</span></p>
                </div>
              </div>
              <div className={`border rounded-[2.5rem] p-8 flex flex-col justify-center shadow-2xl transition-all duration-500 ${totals.remaining < 0 ? 'bg-rose-950 border-rose-800' : 'bg-[#c5a059] border-[#c5a059]'}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${totals.remaining < 0 ? 'text-rose-200' : 'text-black/60'}`}>Available Delta</p>
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-black italic tracking-tighter ${totals.remaining < 0 ? 'text-white' : 'text-black'}`}>{Math.round(totals.remaining)}</span>
                  <span className={`text-xs font-bold mb-2 ${totals.remaining < 0 ? 'text-rose-300' : 'text-black/40'}`}>KCAL</span>
                </div>
                {totals.remaining < 0 && (
                   <p className="text-[10px] font-black uppercase mt-4 text-rose-300 animate-pulse flex items-center gap-2">
                     <TrendingUp size={12} /> Deficit Warning Active
                   </p>
                )}
              </div>
            </div>

            {/* Macro Breakdown Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] p-8 shadow-xl">
                  <h3 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <PieChart size={14} /> Macronutrient Balance
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={macroData} layout="vertical" margin={{ left: -10, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#444" fontSize={10} fontWeight="900" width={60} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '12px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                          {macroData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    {macroData.map((m, i) => (
                      <div key={i} className="bg-black/40 p-3 rounded-2xl border border-[#222]">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1">{m.name}</p>
                        <p className="text-sm font-black text-white">{Math.round(m.value)}g</p>
                      </div>
                    ))}
                  </div>
               </div>

               <AIAssistant userContext={userContextString} />
            </div>

            {/* Recent Logs Table */}
            <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="px-8 py-5 border-b border-[#222] flex justify-between items-center">
                <h3 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                  <TrendingUp size={14} /> Activity Ledger
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="text-[8px] font-black uppercase text-slate-500 tracking-widest bg-black/30">
                    <tr>
                      <th className="px-8 py-4">Descriptor</th>
                      <th className="px-8 py-4">Impact</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {meals.map(m => (
                      <tr key={m.id} className="group hover:bg-black/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white group-hover:text-[#c5a059] transition-colors">{m.name}</span>
                            <span className="text-[9px] text-slate-600 font-bold uppercase mt-1">
                              P: {m.protein}g • C: {m.carbs}g • F: {m.fats}g
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-black italic tracking-tighter text-white">-{m.calories} <span className="text-[9px] opacity-40">KCAL</span></span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => deleteMeal(m.id)} className="text-slate-700 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {exercises.map(ex => (
                      <tr key={ex.id} className="group bg-[#c5a059]/5 hover:bg-[#c5a059]/10 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#c5a059]">{ex.name}</span>
                            <span className="text-[9px] text-[#c5a059]/60 font-bold uppercase mt-1">{ex.duration} MIN SESSION</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-black italic tracking-tighter text-[#c5a059]">+{ex.caloriesBurned} <span className="text-[9px] opacity-40">KCAL</span></span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => deleteEx(ex.id)} className="text-slate-700 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {meals.length === 0 && exercises.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Target size={40} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Strategic Data Logged</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer Brand */}
        <footer className="pt-12 pb-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
           <p className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Protocol © 2025</p>
           <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em]">
             <button className="hover:text-[#c5a059] transition-colors">Integrations</button>
             <button className="hover:text-[#c5a059] transition-colors">Lab Reports</button>
             <button className="hover:text-[#c5a059] transition-colors">Coaching Access</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
