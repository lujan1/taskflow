import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

// Componentes del Sistema
import Navbar from '../components/Navbar'; 
import SystemTour from '../components/SystemTour';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { SecurityWarningModal } from '../components/SecurityWarningModal';

// Estilos
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [loading, setLoading] = useState(true);
  
  // 🍔 Estado único para controlar el menú lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Traer tareas desde el backend con limpieza de montaje
  useEffect(() => {
    let isMounted = true; 

    const fetchTasks = async () => {
      try {
        const { data } = await API.get('/tasks');
        if (isMounted) {
          setTasks(data);
        }
      } catch (error) {
        console.error("❌ Error cargando tareas en el Dashboard:", error.message);
        if (isMounted) {
          logout(); 
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [logout]); 

  // Handlers de estado para sincronizar la UI
  const handleCreate = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleUpdate = (updated) => {
    setTasks((prevTasks) => prevTasks.map(t => t.id === updated.id ? updated : t));
  };

  const handleDelete = (id) => {
    setTasks((prevTasks) => prevTasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-active' : ''}`}>
      {/* Modales globales del sistema */}
      <SecurityWarningModal />
      <SystemTour />

      {/* 🍔 BARRA SUPERIOR ÚNICA */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* 📋 MENÚ LATERAL (SIDEBAR) CORREGIDO (Sin links vacíos ni emojis sueltos) */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-links">
          <h3>Menú de Usuario</h3>
          
          <button type="button" className="sidebar-btn-link" onClick={() => setIsSidebarOpen(false)}>
            <span role="img" aria-label="perfil">👤</span> Mi Perfil
          </button>
          
          <button type="button" className="sidebar-btn-link" onClick={() => setIsSidebarOpen(false)}>
            <span role="img" aria-label="estadisticas">📊</span> Estadísticas
          </button>
          
          <hr className="sidebar-divider" />
          
          <button type="button" onClick={logout} className="logout-sidebar-btn">
            <span role="img" aria-label="cerrar sesion">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="dashboard-content-body">
        <main className="dashboard-main">
          
          {/* Saludo integrado directamente (Diseño limpio sin clima redundante) */}
          <div className="dashboard-welcome-container">
            <h1>Asistente de Productividad</h1>
            <p>Bienvenido de vuelta, <span className="username-highlight">{user?.name || 'Carlos'}</span>. Gestiona tu agenda de hoy.</p>
          </div>

          {/* Formulario envuelto para el paso 3 del tour */}
          <div id="tour-step-3" className="form-container-tour">
            <TaskForm onCreate={handleCreate} />
          </div>

          {/* Filtros de tareas (Mapeo limpio sin ternarios anidados) */}
          <div className="filter-buttons">
            {['all', 'pending', 'completed'].map(f => {
              const labels = {
                all: 'Todas',
                pending: 'Pendientes',
                completed: 'Completadas'
              };

              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={filter === f ? 'active' : ''}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>

          {/* Grilla de tareas con estados de carga */}
          {loading ? (
            <p className="loading-text">Cargando tareas...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="empty-text">No hay tareas en esta categoría.</p>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;