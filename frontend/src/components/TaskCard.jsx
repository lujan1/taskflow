import { useState } from 'react';
import API from '../api/axios';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  
  // Estado local para cuando el usuario está escribiendo cambios activamente
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  // Cambiar estado entre pending y completed (No requiere un efecto)
  const toggleStatus = async () => {
    setLoading(true);
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const { data } = await API.put(`/tasks/${task.id}`, { status: newStatus });
      onUpdate(data);
    } catch (error) {
      console.error('❌ Error al cambiar el estado de la tarea:', error.message);
      alert('No se pudo actualizar el estado de la tarea. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Activa el modo edición cargando los valores actuales de la tarea de forma explícita
  const handleStartEdit = () => {
    setEditData({
      title: task.title || '',
      description: task.description || ''
    });
    setEditing(true);
  };

  // Guardar edición de título y descripción
  const saveEdit = async () => {
    if (!editData.title.trim()) {
      alert('El título de la tarea no puede estar vacío.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.put(`/tasks/${task.id}`, {
        title: editData.title.trim(),
        description: editData.description.trim()
      });
      onUpdate(data);
      setEditing(false);
    } catch (error) {
      console.error('❌ Error al guardar la edición de la tarea:', error.message);
      alert('Hubo un error al intentar guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`task-card ${task.status}`}>
      {editing ? (
        <>
          <input
            type="text"
            value={editData.title}
            onChange={e => setEditData({ ...editData, title: e.target.value })}
            placeholder="Título de la tarea"
            disabled={loading}
          />
          <textarea
            value={editData.description}
            onChange={e => setEditData({ ...editData, description: e.target.value })}
            placeholder="Descripción de la tarea"
            disabled={loading}
          />
          <div className="task-actions">
            <button onClick={saveEdit} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={() => setEditing(false)} disabled={loading} className="btn-cancel">
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description || <i>Sin descripción</i>}</p>
          
          <span className={`status-badge ${task.status}`}>
            {task.status === 'pending' ? 'Pendiente' : 'Completada'}
          </span>
          
          <div className="task-actions">
            <button onClick={toggleStatus} disabled={loading}>
              {task.status === 'pending' ? '✓ Completar' : '⟲ Pendiente'}
            </button>
            <button onClick={handleStartEdit} disabled={loading}>
              ✏ Editar
            </button>
            <button 
              onClick={() => {
                if (window.confirm('¿Eliminar esta tarea?')) {
                  setLoading(true);
                  API.delete(`/tasks/${task.id}`)
                    .then(() => onDelete(task.id))
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false));
                }
              }} 
              disabled={loading} 
              className="btn-delete"
            >
              🗑 Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;