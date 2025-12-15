const apiGestionPracticantesUrl = 'https://xmlcomparertool.onrender.com';
const API_URL = `${apiGestionPracticantesUrl}/api/v1`;
let tareasFinalizadasModal = null;
let practicanteId = null;
let usuarioActual = null;

// Función para mostrar alertas flotantes
function mostrarAlerta(mensaje, tipo = 'info') {
  const alertContainer = document.getElementById('alertContainer');
  const alertId = 'alert-' + Date.now();
  
  const alertHTML = `
    <div id="${alertId}" class="floating-alert alert alert-${tipo} alert-dismissible fade show" role="alert">
      <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  
  alertContainer.innerHTML += alertHTML;
  
  // Auto-eliminar la alerta después de 5 segundos
  setTimeout(() => {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
      alertElement.remove();
    }
  }, 5000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Obtener información del usuario desde localStorage
  const usuarioGuardado = localStorage.getItem('usuarioActual');
  
  if (!usuarioGuardado) {
    mostrarAlerta('No se encontró información del usuario. Redirigiendo...', 'warning');
    setTimeout(() => {
      window.location.href = 'usuarios.html';
    }, 2000);
    return;
  }

  try {
    usuarioActual = JSON.parse(usuarioGuardado);
    practicanteId = usuarioActual.id;
    
    // Actualizar la interfaz con la información del usuario
    document.getElementById('usuarioNombre').textContent = usuarioActual.nombre;
    document.getElementById('usuarioRol').textContent = usuarioActual.rol;
    document.getElementById('usuarioNavbar').textContent = usuarioActual.nombre;

    console.log('Usuario cargado:', usuarioActual);
    console.log('ID del practicante:', practicanteId);

    // Inicializar el modal de Bootstrap
    const modalElement = document.getElementById('tareasFinalizadasModal');
    tareasFinalizadasModal = new bootstrap.Modal(modalElement);
    
    // Cargar datos iniciales
    loadTasks();
    loadSkills();
    loadEstadisticas();

  } catch (error) {
    console.error('Error cargando información del usuario:', error);
    mostrarAlerta('Error al cargar la información del usuario. Redirigiendo...', 'danger');
    setTimeout(() => {
      window.location.href = 'usuarios.html';
    }, 2000);
  }
});

// Color del badge según estado
function getStatusBadgeColor(status) {
  const colores = {
    'Asignada': 'warning',
    'En curso': 'info',
    'Finalizada': 'success'
  };
  return colores[status] || 'secondary';
}

// Clase CSS según estado para el borde izquierdo
function getTareaClass(estado) {
  const clases = {
    'Asignada': 'tarea-asignada',
    'En curso': 'tarea-progreso',
    'Finalizada': 'tarea-completada'
  };
  return clases[estado] || '';
}

// Clase CSS para actividades según estado
function getActividadClass(estado) {
  const clases = {
    'Asignada': '',
    'En curso': 'actividad-en-curso',
    'Finalizada': 'actividad-completada'
  };
  return clases[estado] || '';
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'No definida';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Cargar actividades de una tarea
async function loadActividadesTarea(tareaId) {
  try {
    const response = await axios.get(`${API_URL}/actividades/tarea/${tareaId}`);
    return response.data;
  } catch (error) {
    console.error('Error cargando actividades:', error);
    return [];
  }
}

// Calcular progreso de actividades
function calcularProgresoActividades(actividades) {
  if (!actividades || actividades.length === 0) return 0;
  
  const completadas = actividades.filter(act => act.nom_estado === 'Finalizada').length;
  return Math.round((completadas / actividades.length) * 100);
}

// Cargar tareas del practicante con sus actividades
async function loadTasks() {
  if (!practicanteId) {
    console.error('No hay ID de practicante definido');
    return;
  }

  try {
    console.log('Cargando tareas para el practicante ID:', practicanteId);
    const response = await axios.get(`${API_URL}/tareas/practicante/${practicanteId}`);
    const tasksList = document.getElementById("tasksList");
    
    console.log('Tareas recibidas:', response.data);
    
    // Filtrar solo tareas activas (no completadas)
    const tareasActivas = response.data.filter(tarea => 
      tarea.nom_estado !== 'Finalizada'
    );
    
    console.log('Tareas activas filtradas:', tareasActivas);
    
    if (tareasActivas.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-check-circle text-success"></i>
          <p class="mb-0">No tienes tareas activas actualmente.</p>
        </div>
      `;
      return;
    }

    // Cargar actividades para cada tarea
    const tareasConActividades = await Promise.all(
      tareasActivas.map(async (tarea) => {
        const actividades = await loadActividadesTarea(tarea.id_tarea);
        return { ...tarea, actividades };
      })
    );

    tasksList.innerHTML = tareasConActividades.map(tarea => {
      const progreso = calcularProgresoActividades(tarea.actividades);
      
      return `
        <div class="card card-tarea mb-4 ${getTareaClass(tarea.nom_estado)}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h6 class="card-title text-dark mb-2 d-flex align-items-center">
                  <i class="bi bi-card-checklist me-2"></i> ${tarea.nom_tarea}
                </h6>
                
                <div class="row mb-2">
                  <div class="col-md-6">
                    <small class="text-muted d-flex align-items-center"><i class="bi bi-person me-1"></i> <strong>Asignado por:</strong></small>
                    <small class="text-muted">${tarea.asignador || 'No especificado'}</small>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-flex align-items-center"><i class="bi bi-info-circle me-1"></i> <strong>Estado tarea:</strong></small>
                    <span class="badge badge-estado bg-${getStatusBadgeColor(tarea.nom_estado)}">
                      ${tarea.nom_estado || 'Asignada'}
                    </span>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <small class="text-muted d-flex align-items-center"><i class="bi bi-play-circle me-1"></i> <strong>Inicio:</strong></small>
                    <small class="text-muted">${formatDate(tarea.fecha_ini)}</small>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-flex align-items-center"><i class="bi bi-flag me-1"></i> <strong>Fin:</strong></small>
                    <small class="text-muted">${formatDate(tarea.fecha_fin)}</small>
                  </div>
                </div>

                <!-- Barra de progreso -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <small class="text-muted"><strong>Progreso de actividades:</strong></small>
                    <small class="text-muted">${progreso}%</small>
                  </div>
                  <div class="progress progress-bar-actividades">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${progreso}%" 
                         aria-valuenow="${progreso}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actividades -->
            <div class="actividades-container">
              <h6 class="small fw-bold mb-2 d-flex align-items-center">
                <i class="bi bi-list-check me-1"></i> Actividades (${tarea.actividades.length})
              </h6>
              
              ${tarea.actividades.length === 0 ? `
                <div class="empty-state py-3">
                  <i class="bi bi-info-circle"></i>
                  <p class="mb-0 small">No hay actividades asignadas para esta tarea.</p>
                </div>
              ` : ''}
              
              ${tarea.actividades.map(actividad => `
                <div class="actividad-item ${getActividadClass(actividad.nom_estado)}">
                  <div class="actividad-header">
                    <span class="small fw-bold">${actividad.descripcion}</span>
                    <span class="badge badge-estado bg-${getStatusBadgeColor(actividad.nom_estado)}">
                      ${actividad.nom_estado}
                    </span>
                  </div>
                  
                  ${actividad.nom_estado !== 'Finalizada' ? `
                    <div class="actividad-actions">
                      ${actividad.nom_estado === 'Asignada' ? `
                        <button class="btn btn-info btn-actividad-estado d-flex align-items-center" 
                                onclick="updateActividadEstado(${actividad.id_actividad}, 2)">
                          <i class="bi bi-play-circle me-1"></i> Iniciar
                        </button>
                      ` : ''}
                      
                      ${actividad.nom_estado === 'En curso' ? `
                        <button class="btn btn-success btn-actividad-estado d-flex align-items-center" 
                                onclick="updateActividadEstado(${actividad.id_actividad}, 3)">
                          <i class="bi bi-check-circle me-1"></i> Finalizar
                        </button>
                      ` : ''}
                      
                      <button class="btn btn-outline-secondary btn-actividad-estado d-flex align-items-center" 
                              onclick="updateActividadEstado(${actividad.id_actividad}, 1)">
                        <i class="bi bi-arrow-counterclockwise me-1"></i> Reasignar
                      </button>
                    </div>
                  ` : `
                    <div class="mt-1">
                      <small class="text-success d-flex align-items-center">
                        <i class="bi bi-check-circle me-1"></i> Actividad completada
                      </small>
                    </div>
                  `}
                </div>
              `).join('')}
            </div>

            <!-- Actualizar estado de la tarea -->
            ${tarea.nom_estado !== 'Finalizada' ? `
              <div class="tarea-actions">
                <label class="form-label small"><strong>Actualizar estado de la tarea:</strong></label>
                <div class="d-flex gap-2">
                  <button class="btn btn-info btn-sm d-flex align-items-center" onclick="updateTaskStatus(${tarea.id_tarea}, 2)">
                    <i class="bi bi-play-circle me-1"></i> En curso
                  </button>
                  <button class="btn btn-success btn-sm d-flex align-items-center" onclick="updateTaskStatus(${tarea.id_tarea}, 3)">
                    <i class="bi bi-check-circle me-1"></i> Finalizar
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error("Error cargando tareas:", error);
    document.getElementById("tasksList").innerHTML = `
      <div class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i> Error al cargar las tareas: ${error.message}
      </div>
    `;
  }
}

// Actualizar estado de una actividad
async function updateActividadEstado(actividadId, nuevoEstadoId) {
  const estados = {
    '1': 'Asignada',
    '2': 'En curso', 
    '3': 'Finalizada'
  };
  
  const nombreEstado = estados[nuevoEstadoId];
  
  if (!confirm(`¿Deseas cambiar el estado de esta actividad a "${nombreEstado}"?`)) return;

  try {
    await axios.patch(`${API_URL}/actividades/${actividadId}/estado`, { 
      id_estado: nuevoEstadoId 
    });
    
    mostrarAlerta(`Estado de actividad actualizado a "${nombreEstado}"`, 'success');
    loadTasks(); // Recargar tareas para ver los cambios
    loadEstadisticas(); // Actualizar estadísticas
    
  } catch (error) {
    console.error("Error actualizando estado de actividad:", error);
    mostrarAlerta("Error al actualizar el estado: " + (error.response?.data?.message || error.message), 'danger');
  }
}

// Actualizar estado de tarea
async function updateTaskStatus(taskId, newStatusId) {
  const estados = {
    '2': 'En curso',
    '3': 'Finalizada'
  };

  const nombreEstado = estados[newStatusId];
  
  if (!confirm(`¿Deseas cambiar el estado de esta tarea a "${nombreEstado}"?`)) return;

  try {
    await axios.patch(`${API_URL}/tareas/${taskId}/estado`, { 
      id_estado: newStatusId 
    });
    
    mostrarAlerta(`Estado de tarea actualizado a "${nombreEstado}"`, 'success');
    loadTasks();
    loadEstadisticas();
    
  } catch (error) {
    console.error("Error actualizando estado de tarea:", error);
    mostrarAlerta("Error al actualizar el estado: " + (error.response?.data?.message || error.message), 'danger');
  }
}

// Cargar tareas finalizadas para el modal
async function loadTareasFinalizadas() {
  if (!practicanteId) return;

  try {
    const response = await axios.get(`${API_URL}/tareas/practicante/${practicanteId}`);
    const tareasFinalizadasList = document.getElementById("tareasFinalizadasList");
    
    // Filtrar solo tareas completadas
    const tareasCompletadas = response.data.filter(tarea => 
      tarea.nom_estado === 'Finalizada'
    );
    
    if (tareasCompletadas.length === 0) {
      tareasFinalizadasList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-info-circle"></i>
          <p class="mb-0">No tienes tareas finalizadas.</p>
        </div>
      `;
      return;
    }

    tareasFinalizadasList.innerHTML = tareasCompletadas.map(task => `
      <div class="card card-tarea mb-3 tarea-completada">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="card-title text-dark mb-2 d-flex align-items-center">
                <i class="bi bi-check-circle text-success me-2"></i> ${task.nom_tarea}
              </h6>
              
              <div class="row mb-2">
                <div class="col-md-6">
                  <small class="text-muted d-flex align-items-center"><i class="bi bi-person me-1"></i> <strong>Asignado por:</strong></small>
                  <small class="text-muted">${task.asignador || 'No especificado'}</small>
                </div>
                <div class="col-md-6">
                  <small class="text-muted d-flex align-items-center"><i class="bi bi-info-circle me-1"></i> <strong>Estado:</strong></small>
                  <span class="badge badge-estado bg-success">
                    ${task.nom_estado}
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <small class="text-muted d-flex align-items-center"><i class="bi bi-play-circle me-1"></i> <strong>Inicio:</strong></small>
                  <small class="text-muted">${formatDate(task.fecha_ini)}</small>
                </div>
                <div class="col-md-6">
                  <small class="text-muted d-flex align-items-center"><i class="bi bi-flag me-1"></i> <strong>Fin:</strong></small>
                  <small class="text-muted">${formatDate(task.fecha_fin)}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error("Error cargando tareas finalizadas:", error);
    document.getElementById("tareasFinalizadasList").innerHTML = `
      <div class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i> Error al cargar las tareas finalizadas: ${error.message}
      </div>
    `;
  }
}

// Ver tareas finalizadas en modal
async function verTareasFinalizadas() {
  await loadTareasFinalizadas();
  if (tareasFinalizadasModal) {
    tareasFinalizadasModal.show();
  }
}

// Cargar habilidades
async function loadSkills() {
  if (!practicanteId) return;

  try {
    const response = await axios.get(`${API_URL}/usuarios/${practicanteId}`);
    const skillsList = document.getElementById("skillsList");
    const skills = response.data.habilidades || [];
    
    if (skills.length === 0) {
      skillsList.innerHTML = '<p class="text-muted text-center py-3">No tienes habilidades registradas</p>';
      return;
    }

    skillsList.innerHTML = `
      <div class="d-flex flex-wrap gap-2">
        ${skills.map(skill => `
          <span class="badge skill-badge d-flex align-items-center">
            ${skill.nombre_hab}
            <button class="btn btn-sm p-0 ms-1 text-white" onclick="deleteSkill(${skill.id_habilidad})" style="border: none; background: none;">
              <i class="bi bi-x-circle"></i>
            </button>
          </span>
        `).join('')}
      </div>
    `;

  } catch (error) {
    console.error("Error cargando habilidades:", error);
    document.getElementById("skillsList").innerHTML = `
      <p class="text-danger small text-center">
        <i class="bi bi-exclamation-triangle me-1"></i> Error al cargar habilidades
      </p>
    `;
  }
}

// Añadir habilidad
document.getElementById("skillForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  if (!practicanteId) {
    mostrarAlerta('No se ha identificado al usuario', 'warning');
    return;
  }

  const skillName = document.getElementById("skillInput").value.trim();
  
  if (!skillName) {
    mostrarAlerta('Por favor ingresa el nombre de la habilidad', 'warning');
    return;
  }

  try {
    await axios.post(`${API_URL}/habilidades`, {
      id_usuario: practicanteId,
      nombre_hab: skillName
    });
    
    document.getElementById("skillInput").value = "";
    mostrarAlerta('Habilidad añadida correctamente', 'success');
    loadSkills();
    
  } catch (error) {
    console.error("Error añadiendo habilidad:", error);
    mostrarAlerta("Error al añadir habilidad: " + (error.response?.data?.message || error.message), 'danger');
  }
});

// Eliminar habilidad
async function deleteSkill(skillId) {
  if (!confirm('¿Estás seguro de eliminar esta habilidad?')) return;

  try {
    await axios.delete(`${API_URL}/habilidades/${skillId}`);
    mostrarAlerta('Habilidad eliminada correctamente', 'success');
    loadSkills();
    
  } catch (error) {
    console.error("Error eliminando habilidad:", error);
    mostrarAlerta("Error al eliminar habilidad: " + (error.response?.data?.message || error.message), 'danger');
  }
}

// Cargar estadísticas
async function loadEstadisticas() {
  if (!practicanteId) return;

  try {
    const response = await axios.get(`${API_URL}/tareas/practicante/${practicanteId}`);
    const tareas = response.data;
    
    const finalizadas = tareas.filter(t => t.nom_estado === 'Finalizada').length;
    const enCurso = tareas.filter(t => t.nom_estado === 'En curso').length;
    const asignadas = tareas.filter(t => t.nom_estado === 'Asignada').length;
    const total = tareas.length;
    
    document.getElementById('estadisticas').innerHTML = `
      <div class="text-center">
        <div class="row">
          <div class="col-6 mb-3">
            <div class="stats-card">
              <div class="stats-number text-success">${finalizadas}</div>
              <div class="stats-label">Finalizadas</div>
            </div>
          </div>
          <div class="col-6 mb-3">
            <div class="stats-card">
              <div class="stats-number text-info">${enCurso}</div>
              <div class="stats-label">En curso</div>
            </div>
          </div>
          <div class="col-6">
            <div class="stats-card">
              <div class="stats-number text-warning">${asignadas}</div>
              <div class="stats-label">Asignadas</div>
            </div>
          </div>
          <div class="col-6">
            <div class="stats-card">
              <div class="stats-number text-primary">${total}</div>
              <div class="stats-label">Total</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    document.getElementById('estadisticas').innerHTML = `
      <p class="text-muted small text-center">No se pudieron cargar las estadísticas</p>
    `;
  }
}