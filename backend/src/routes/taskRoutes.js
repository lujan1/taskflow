const router = require('express').Router();

// CORREGIDO: Se cambió a 'middleware' (en singular) para que coincida exactamente con tu carpeta real
const auth = require('../middleware/authMiddleware'); 
const taskController = require('../controllers/taskController');

// Validación defensiva para asegurar que todos los controladores se hayan importado de forma correcta
if (!taskController || !taskController.getTasks || !taskController.createTask || !taskController.updateTask || !taskController.deleteTask) {
    throw new Error('❌ Error crítico: Uno o más métodos CRUD no se encontraron en taskController.js');
}

const { getTasks, createTask, updateTask, deleteTask } = taskController;

// ■■ RUTAS DE TAREAS (Prefijo base: /api/tasks) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Todas estas rutas pasan primero por el middleware 'auth' para validar la sesión antes de operar.

// GET /api/tasks -> Obtiene todas las tareas del usuario logueado
router.get('/', auth, getTasks); 

// POST /api/tasks -> Crea una nueva tarea para el usuario logueado
router.post('/', auth, createTask); 

// PUT /api/tasks/:id -> Modifica una tarea existente (por su ID en la URL)
router.put('/:id', auth, updateTask); 

// DELETE /api/tasks/:id -> Elimina una tarea del sistema (por su ID en la URL)
router.delete('/:id', auth, deleteTask); 

module.exports = router;