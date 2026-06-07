import { useState } from 'react';
import API from '../api/axios';

const TaskForm = ({ onCreate }) => {
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Previene envíos duplicados

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación rigurosa de espacios en blanco
    if (!form.title.trim()) { 
      setError('El título es requerido y no puede estar vacío.'); 
      return; 
    }

    setLoading(true);
    try {
      // Envío de datos al backend (POST /api/tasks)
      const { data } = await API.post('/tasks', form);
      
      // Pasar la nueva tarea al componente padre (Dashboard) para actualizar la lista en tiempo real
      onCreate(data);
      
      // Limpiar el formulario de forma segura
      setForm({ title: '', description: '' }); 
    } catch (err) {
      console.error('❌ Error en el formulario de creación de tareas:', err);
      setError(err.response?.data?.message || 'Error de conexión al crear la tarea. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Nueva Tarea</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <input
        type="text" 
        placeholder="Título de la tarea"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        disabled={loading}
        required
      />
      
      <textarea
        placeholder="Descripción (opcional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Agregando...' : '+ Agregar Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;