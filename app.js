const { useState, useEffect } = React;

// Notre base de données d'exercices
const EXERCISE_DATABASE = [
  { name: "Développé couché", type: "Pectoraux" },
  { name: "Squat", type: "Jambes" },
  { name: "Soulevé de terre", type: "Dos" },
  { name: "Développé militaire", type: "Épaules" },
  { name: "Tractions", type: "Dos" },
  { name: "Dips", type: "Triceps" },
  { name: "Curl biceps", type: "Biceps" },
];

function App() {
  // Gestion de l'onglet actif
  const [activeTab, setActiveTab] = useState('workout');
  // Historique des entraînements
  const [history, setHistory] = useState([]);
  
  // Charger l'historique depuis le localStorage au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('fittracker_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // Sauvegarder l'historique dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('fittracker_history', JSON.stringify(history));
  }, [history]);
  
  const addWorkoutToHistory = (workout) => {
    const newHistory = [workout, ...history];
    setHistory(newHistory);
  };

  return (
    <div>
      <header className="app-header">
        <h1>FitTracker</h1>
      </header>
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          Entraînement
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historique
        </button>
      </div>

      {activeTab === 'workout' && <WorkoutForm onWorkoutComplete={addWorkoutToHistory} />}
      {activeTab === 'history' && <History workouts={history} />}
    </div>
  );
}

function WorkoutForm({ onWorkoutComplete }) {
  const [currentExercises, setCurrentExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_DATABASE[0].name);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);

  const handleAddExercise = () => {
    const newExercise = {
      name: selectedExercise,
      details: `${sets} sets x ${reps} reps @ ${weight} kg`
    };
    setCurrentExercises([...currentExercises, newExercise]);
  };

  const handleFinishWorkout = () => {
    if (currentExercises.length === 0) {
      alert("Ajoutez au moins un exercice avant de terminer !");
      return;
    }
    const newWorkout = {
      date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      timestamp: new Date().toISOString(),
      exercises: currentExercises
    };
    onWorkoutComplete(newWorkout);
    setCurrentExercises([]); // Réinitialiser le formulaire
  };
  
  return (
    <div className="card workout-form">
      <h2>Séance du jour</h2>
      <div className="form-group">
        <label>Exercice</label>
        <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
          {EXERCISE_DATABASE.map(exo => <option key={exo.name} value={exo.name}>{exo.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Séries</label>
        <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Répétitions</label>
        <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Poids (kg)</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleAddExercise} style={{marginBottom: '10px'}}>Ajouter l'exercice</button>
      
      {currentExercises.length > 0 && (
        <>
          <ul className="added-exercises-list">
            {currentExercises.map((exo, index) => (
              <li key={index} className="added-exercise-item">
                <span><strong>{exo.name}</strong></span>
                <span>{exo.details}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={handleFinishWorkout} style={{marginTop: '1.5rem', backgroundColor: '#2ecc71'}}>Terminer la séance</button>
        </>
      )}
    </div>
  );
}

function History({ workouts }) {
  if (workouts.length === 0) {
    return <div className="card history"><h2>Historique</h2><p>Aucun entraînement enregistré.</p></div>;
  }
  
  return (
    <div className="card history">
      <h2>Historique des séances</h2>
      {workouts.map(workout => (
        <div key={workout.timestamp} className="workout-history-item">
          <h3>{workout.date}</h3>
          <ul>
            {workout.exercises.map((exo, index) => (
              <li key={index}><strong>{exo.name}:</strong> {exo.details}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);