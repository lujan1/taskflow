import { useState } from 'react';
import '../styles/SystemTour.css';

const tourSteps = [
  {
    elementId: 'tour-step-1',
    title: '🍔 Panel de Control',
    description: 'Usa la hamburguesa de la izquierda para desplegar el menú con tus estadísticas, configuraciones y accesos rápidos.'
  },
  {
    elementId: 'tour-step-2',
    title: '⏱️ Tu Tiempo Cuenta',
    description: 'En el centro tienes el reloj en tiempo real para controlar tus sesiones de enfoque y entregas.'
  },
  {
    elementId: 'tour-step-3',
    title: '📥 Inyectar Tareas',
    description: 'Desde este formulario puedes registrar nuevos pendientes directo en tu base de datos de PostgreSQL.'
  }
];

const SystemTour = () => {
  // 🧠 Inicialización perezosa: Lee localStorage de una vez al nacer el componente
  const [isOpen, setIsOpen] = useState(() => {
    const hasSeenTour = localStorage.getItem('taskflow_tour_seen');
    return !hasSeenTour; // Si NO lo ha visto, se inicializa en true automáticamente
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  const closeTour = () => {
    localStorage.setItem('taskflow_tour_seen', 'true');
    setIsOpen(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  return (
    <>
      {/* 💡 EL FOCO FLOTANTE (Siempre visible para ayuda rápida) */}
      <button className="floating-bulb-btn" onClick={() => setIsOpen(true)} title="Ver cómo funciona el sistema">
        💡
      </button>

      {/* MODAL DEL TOUR INTERACTIVO */}
      {isOpen && (
        <div className="tour-overlay">
          <div className="tour-card">
            <h3>{tourSteps[currentStep].title}</h3>
            <p>{tourSteps[currentStep].description}</p>
            
            <div className="tour-actions">
              <button className="btn-skip" onClick={closeTour}>Saltar</button>
              <button className="btn-next" onClick={nextStep}>
                {currentStep === tourSteps.length - 1 ? 'Entendido ✔️' : 'Siguiente ➡️'}
              </button>
            </div>
            
            <div className="tour-progress">
              {tourSteps.map((_, idx) => (
                <span key={idx} className={idx === currentStep ? 'dot active' : 'dot'} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SystemTour;