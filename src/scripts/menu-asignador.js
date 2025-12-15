// src/scripts/menu-asignador.js
const apiGestionPracticantesUrl = 'https://xmlcomparertool.onrender.com';
const API_URL = `${apiGestionPracticantesUrl}/api/v1`;
let selectedPracticanteId = null;
let selectedPracticanteName = '';
let historialModal = null;
let actividadCounter = 0;
let usuarioAsignador = null;

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

// Cargar practicantes al iniciar
document.addEventListener('DOMContentLoaded', function() {
  // Obtener información del usuario asignador desde localStorage
  const usuarioGuardado = localStorage.getItem('usuarioActual');
  if (usuarioGuardado) {
    usuarioAsignador = JSON.parse(usuarioGuardado);
    document.getElementById('asignadorNombre').textContent = `${usuarioAsignador.nombre} (${usuarioAsignador.rol})`;
  }
  
  cargarPracticantes();
  // Establecer fecha mínima como hoy
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('taskStart').min = today;
  document.getElementById('taskEnd').min = today;
  
  // Inicializar modal
  const modalElement = document.getElementById('historialModal');
  historialModal = new bootstrap.Modal(modalElement);
  
  // Agregar primera actividad por defecto
  agregarActividad();
});

// Función para agregar una nueva actividad
function agregarActividad() {
  actividadCounter++;
  const actividadesContainer = document.getElementById('actividadesContainer');
  const sinActividadesMsg = document.getElementById('sinActividadesMsg');
  
  // Ocultar mensaje de "sin actividades"
  if (sinActividadesMsg) {
    sinActividadesMsg.style.display = 'none';
  }
  
  const actividadDiv = document.createElement('div');
  actividadDiv.className = 'actividad-item';
  actividadDiv.id = `actividad-${actividadCounter}`;
  
  actividadDiv.innerHTML = `
    <div class="actividad-header">
      <h6 class="mb-0 d-flex align-items-center"><i class="bi bi-list-task me-2"></i> Actividad ${actividadCounter}</h6>
      <button type="button" class="btn-remove-actividad" onclick="eliminarActividad(${actividadCounter})" ${actividadCounter === 1 ? 'disabled' : ''}>
        <i class="bi bi-trash"></i>
      </button>
    </div>
    <div class="mb-3">
      <label class="form-label fw-semibold">Descripción de la actividad *</label>
      <textarea class="form-control actividad-descripcion" placeholder="Describa la actividad a realizar..." rows="2" required></textarea>
    </div>
  `;
  
  actividadesContainer.appendChild(actividadDiv);
  actualizarEstadoBotonGuardar();
}

// Función para eliminar una actividad
function eliminarActividad(id) {
  const actividadDiv = document.getElementById(`actividad-${id}`);
  if (actividadDiv) {
    actividadDiv.remove();
  }
  
  // Verificar si quedan actividades
  const actividades = document.querySelectorAll('.actividad-item');
  const sinActividadesMsg = document.getElementById('sinActividadesMsg');
  
  if (actividades.length === 0 && sinActividadesMsg) {
    sinActividadesMsg.style.display = 'block';
  }
  
  actualizarEstadoBotonGuardar();
}

// Función para actualizar el estado del botón guardar
function actualizarEstadoBotonGuardar() {
  const actividades = document.querySelectorAll('.actividad-item');
  const btnGuardar = document.getElementById('btnGuardarTarea');
  
  if (actividades.length === 0) {
    btnGuardar.disabled = true;
    btnGuardar.title = 'Debe agregar al menos una actividad';
  } else {
    btnGuardar.disabled = false;
    btnGuardar.title = '';
  }
}

// Obtener todas las actividades del formulario
function obtenerActividadesDelFormulario() {
  const actividades = [];
  const actividadesElements = document.querySelectorAll('.actividad-item');
  
  actividadesElements.forEach(actividadElement => {
    const textarea = actividadElement.querySelector('.actividad-descripcion');
    if (textarea) {
      const descripcion = textarea.value.trim();
      if (descripcion) {
        actividades.push({
          descripcion: descripcion,
          id_estado_tarea: 1 // Estado "Asignada" por defecto
        });
      }
    }
  });
  
  return actividades;
}

// Cargar lista de practicantes
async function cargarPracticantes() {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    const select = document.getElementById('practicanteSelect');
    
    // Limpiar select excepto la primera opción
    while (select.options.length > 1) {
      select.remove(1);
    }
    
    // Filtrar solo practicantes
    const practicantes = response.data.filter(usuario => 
      usuario.nom_roll && usuario.nom_roll.toLowerCase().includes('practicante')
    );
    
    if (practicantes.length === 0) {
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No hay practicantes disponibles";
      select.appendChild(option);
      return;
    }
    
    practicantes.forEach(practicante => {
      const option = document.createElement('option');
      option.value = practicante.id_usuario;
      option.textContent = practicante.nom_usuario;
      option.setAttribute('data-nombre', practicante.nom_usuario);
      select.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error cargando usuarios:', error);
    mostrarAlerta('Error al cargar la lista de usuarios', 'danger');
  }
}

// Cargar información del practicante seleccionado
async function cargarPracticanteSeleccionado() {
  const select = document.getElementById('practicanteSelect');
  selectedPracticanteId = select.value;

  if (!selectedPracticanteId) {
    document.getElementById('practicanteInfo').style.display = 'none';
    document.getElementById('btnHistorial').style.display = 'none';
    document.getElementById('tasksList').innerHTML = `
      <div class="empty-state">
        <i class="bi bi-person-check"></i>
        <p class="mb-0">Seleccione un practicante para ver sus tareas activas</p>
      </div>
    `;
    return;
  }

  try {
    // Obtener nombre del practicante
    const selectedOption = select.options[select.selectedIndex];
    selectedPracticanteName = selectedOption.getAttribute('data-nombre') || selectedOption.textContent;
    
    // Mostrar información básica (solo nombre, sin ID)
    document.getElementById('practicanteDetails').innerHTML = `
      <p class="fs-5"><strong>Nombre:</strong> ${selectedPracticanteName}</p>
    `;
    
    // Cargar habilidades del practicante
    await cargarHabilidadesPracticante();
    
    // Mostrar el panel de información
    document.getElementById('practicanteInfo').style.display = 'block';
    document.getElementById('btnHistorial').style.display = 'block';

    // Cargar tareas del practicante (solo activas)
    await cargarTareasPracticante();
    
    // Actualizar estadísticas
    await actualizarEstadisticasPracticante();
  } catch (error) {
    console.error('Error cargando información del practicante:', error);
  }
}

// Actualizar estadísticas del practicante
async function actualizarEstadisticasPracticante() {
  if (!selectedPracticanteId) return;
  
  try {
    const response = await axios.get(`${API_URL}/tareas/practicante/${selectedPracticanteId}`);
    const tareas = response.data;
    
    const tareasActivas = tareas.filter(tarea => tarea.nom_estado !== 'Finalizada').length;
    const tareasCompletadas = tareas.filter(tarea => tarea.nom_estado === 'Finalizada').length;
    
    document.getElementById('tareasActivasCount').textContent = tareasActivas;
    document.getElementById('tareasCompletadasCount').textContent = tareasCompletadas;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

// Cargar habilidades del practicante
async function cargarHabilidadesPracticante() {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${selectedPracticanteId}`);
    const skillsContainer = document.getElementById('practicanteSkills');
    const habilidades = response.data.habilidades || [];
    
    if (habilidades.length === 0) {
      skillsContainer.innerHTML = `
        <div class="mt-3">
          <h6 class="d-flex align-items-center"><i class="bi bi-stars me-2"></i> Habilidades:</h6>
          <p class="text-muted">Este practicante no tiene habilidades registradas</p>
        </div>
      `;
      return;
    }

    skillsContainer.innerHTML = `
      <div class="mt-3">
        <h6 class="d-flex align-items-center"><i class="bi bi-stars me-2"></i> Habilidades:</h6>
        <div class="d-flex flex-wrap gap-2">
          ${habilidades.map(skill => `
            <span class="badge skill-badge d-flex align-items-center">
              <i class="bi bi-check-circle me-1"></i> ${skill.nombre_hab}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error cargando habilidades:', error);
    document.getElementById('practicanteSkills').innerHTML = `
      <div class="mt-3">
        <h6 class="d-flex align-items-center"><i class="bi bi-stars me-2"></i> Habilidades:</h6>
        <p class="text-muted">Error al cargar las habilidades</p>
      </div>
    `;
  }
}

// Función para obtener color según estado
function getColorPorEstado(estado) {
  const estados = {
     'Asignada': 'warning',
     'En curso': 'info',
     'Finalizada': 'success'
  };
  return estados[estado] || 'secondary';
}

// Función para obtener clase CSS según estado
function getClasePorEstado(estado) {
  const clases = {
     'Asignada': 'asignada',
     'En curso': 'progreso',
     'Finalizada': 'completada'
  };
  return clases[estado] || '';
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

// Cargar tareas del practicante seleccionado con actividades
async function cargarTareasPracticante() {
  if (!selectedPracticanteId) {
    document.getElementById('tasksList').innerHTML = `
      <div class="empty-state">
        <i class="bi bi-person-check"></i>
        <p class="mb-0">Seleccione un practicante para ver sus tareas activas</p>
      </div>
    `;
    return;
  }

  try {
    console.log('Cargando tareas para el practicante ID:', selectedPracticanteId);
    
    const response = await axios.get(`${API_URL}/tareas/practicante/${selectedPracticanteId}`);
    const tasksList = document.getElementById('tasksList');
    
    console.log('Tareas recibidas:', response.data);
    
    // Filtrar SOLO tareas activas (no completadas)
    const tareasActivas = response.data.filter(tarea => tarea.nom_estado !== 'Finalizada');
    
    console.log('Tareas activas filtradas:', tareasActivas);
    
    if (tareasActivas.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-check-circle text-success"></i>
          <p class="mb-0">No hay tareas activas para este practicante</p>
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

    // Mostrar tareas activas con actividades
    tasksList.innerHTML = tareasConActividades.map(tarea => `
      <div class="card card-tarea mb-3 ${getClasePorEstado(tarea.nom_estado)}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="card-title text-dark mb-2 d-flex align-items-center">
                <i class="bi bi-card-checklist me-2"></i> ${tarea.nom_tarea}
              </h6>
              
              <div class="row mb-2">
                <div class="col-md-6">
                  <small class="text-muted"><strong><i class="bi bi-person me-1"></i> Asignado por:</strong><br>${tarea.asignador || 'No especificado'}</small>
                </div>
                <div class="col-md-6">
                  <small class="text-muted"><strong><i class="bi bi-info-circle me-1"></i> Estado:</strong><br>
                    <span class="badge badge-estado bg-${getColorPorEstado(tarea.nom_estado)}">
                      ${tarea.nom_estado || 'Asignada'}
                    </span>
                  </small>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <small class="text-muted"><strong><i class="bi bi-play-circle me-1"></i> Inicio:</strong><br>${formatDate(tarea.fecha_ini)}</small>
                </div>
                <div class="col-md-6">
                  <small class="text-muted"><strong><i class="bi bi-flag me-1"></i> Fin:</strong><br>${formatDate(tarea.fecha_fin)}</small>
                </div>
              </div>

              <!-- Sección de Actividades -->
              <div class="mt-3">
                <h6 class="small fw-bold mb-2 d-flex align-items-center">
                  <i class="bi bi-list-check me-1"></i> Actividades (${tarea.actividades.length})
                </h6>
                
                ${tarea.actividades.length === 0 ? `
                  <p class="text-muted small">No hay actividades asignadas para esta tarea.</p>
                ` : ''}
                
                ${tarea.actividades.map(actividad => `
                  <div class="actividad-item mb-2 p-2 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="small">${actividad.descripcion}</span>
                      <span class="badge badge-estado bg-${getColorPorEstado(actividad.nom_estado)}">
                        ${actividad.nom_estado}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="ms-3 d-flex flex-column gap-2">
              <button class="btn btn-sm btn-success d-flex align-items-center" onclick="finalizarTarea(${tarea.id_tarea})">
                <i class="bi bi-check-lg me-1"></i> Finalizar
              </button>
              <button class="btn btn-sm btn-danger d-flex align-items-center" onclick="eliminarTarea(${tarea.id_tarea})">
                <i class="bi bi-trash me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error cargando tareas:', error);
    tasksList.innerHTML = `
      <div class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i> Error al cargar las tareas del practicante
      </div>
    `;
  }
}

// Mostrar historial de tareas finalizadas
async function mostrarHistorialTareas() {
  if (!selectedPracticanteId) {
    mostrarAlerta('Por favor seleccione un practicante primero', 'warning');
    return;
  }

  try {
    // Actualizar el nombre en el modal
    document.getElementById('nombrePracticanteHistorial').textContent = selectedPracticanteName;
    
    // Mostrar mensaje de carga
    document.getElementById('historialTareasList').innerHTML = `
      <div class="text-center my-4">
        <div class="loading-spinner text-primary"></div>
        <p class="mt-2 text-muted">Cargando historial de tareas...</p>
      </div>
    `;
    
    // Mostrar el modal
    historialModal.show();
    
    // Obtener todas las tareas del practicante
    const response = await axios.get(`${API_URL}/tareas/practicante/${selectedPracticanteId}`);
    
    // Filtrar solo tareas completadas
    const tareasCompletadas = response.data.filter(tarea => tarea.nom_estado === 'Finalizada');
    
    if (tareasCompletadas.length === 0) {
      document.getElementById('historialTareasList').innerHTML = `
        <div class="empty-state">
          <i class="bi bi-info-circle"></i>
          <p class="mb-0">Este practicante no tiene tareas finalizadas en su historial.</p>
        </div>
      `;
      return;
    }
    
    // Mostrar tareas completadas
    document.getElementById('historialTareasList').innerHTML = `
      <div class="mb-3">
        <span class="badge historial-badge d-inline-flex align-items-center">
          <i class="bi bi-check-circle me-1"></i> Total de tareas finalizadas: ${tareasCompletadas.length}
        </span>
      </div>
      ${tareasCompletadas.map(tarea => `
        <div class="card card-tarea mb-3 completada">
          <div class="card-body">
            <h6 class="card-title text-dark mb-2 d-flex align-items-center">
              <i class="bi bi-card-checklist me-2"></i> ${tarea.nom_tarea}
            </h6>
            
            <div class="row mb-2">
              <div class="col-md-6">
                <small class="text-muted"><strong><i class="bi bi-person me-1"></i> Asignado por:</strong><br>${tarea.asignador || 'No especificado'}</small>
              </div>
              <div class="col-md-6">
                <small class="text-muted"><strong><i class="bi bi-info-circle me-1"></i> Estado:</strong><br>
                  <span class="badge badge-estado bg-success">
                    ${tarea.nom_estado}
                  </span>
                </small>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <small class="text-muted"><strong><i class="bi bi-play-circle me-1"></i> Inicio:</strong><br>${formatDate(tarea.fecha_ini)}</small>
              </div>
              <div class="col-md-6">
                <small class="text-muted"><strong><i class="bi bi-flag me-1"></i> Fin:</strong><br>${formatDate(tarea.fecha_fin)}</small>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    `;
    
  } catch (error) {
    console.error('Error cargando historial de tareas:', error);
    document.getElementById('historialTareasList').innerHTML = `
      <div class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i> Error al cargar el historial de tareas: ${error.message}
      </div>
    `;
  }
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

// Finalizar tarea (marcar como completada)
async function finalizarTarea(idTarea) {
  if (!confirm('¿Está seguro de marcar esta tarea como completada?\n\nLa tarea se moverá al historial de tareas finalizadas.')) return;

  try {
    // Estado 3 = Completada (según tu base de datos)
    await axios.patch(`${API_URL}/tareas/${idTarea}/estado`, { 
      id_estado: 3 
    });
    
    mostrarAlerta('Tarea marcada como completada y movida al historial', 'success');
    cargarTareasPracticante();
    actualizarEstadisticasPracticante();
    
  } catch (error) {
    console.error('Error finalizando tarea:', error);
    mostrarAlerta('Error al finalizar la tarea: ' + (error.response?.data?.message || error.message), 'danger');
  }
}

// Asignar nueva tarea con actividades - MODIFICADO para incluir nombre del asignador
document.getElementById('taskForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!selectedPracticanteId) {
    mostrarAlerta('Por favor seleccione un practicante primero', 'warning');
    return;
  }

  // Verificar que hay un usuario asignador
  if (!usuarioAsignador) {
    mostrarAlerta('No se ha identificado al usuario asignador. Por favor, inicie sesión nuevamente.', 'danger');
    return;
  }

  console.log('Practicante seleccionado ID:', selectedPracticanteId);
  console.log('Practicante seleccionado Nombre:', selectedPracticanteName);
  console.log('Usuario asignador:', usuarioAsignador);

  // Validar que haya al menos una actividad
  const actividades = obtenerActividadesDelFormulario();
  if (actividades.length === 0) {
    mostrarAlerta('Debe agregar al menos una actividad para la tarea', 'warning');
    return;
  }

  try {
    // 1. Crear la tarea principal - Incluyendo el ID del asignador
    const taskData = {
      nom_tarea: document.getElementById('taskTitle').value,
      id_usuario_practicante: selectedPracticanteId,
      fecha_ini: document.getElementById('taskStart').value,
      fecha_fin: document.getElementById('taskEnd').value,
      id_usuario_asignador: usuarioAsignador.id // Usar el ID del usuario logueado
    };

    console.log('Datos de la tarea a enviar:', taskData);

    const tareaResponse = await axios.post(`${API_URL}/tareas`, taskData);
    const nuevaTarea = tareaResponse.data;

    console.log('Tarea creada:', nuevaTarea);

    // 2. Crear las actividades asociadas a la tarea
    for (const actividad of actividades) {
      await axios.post(`${API_URL}/actividades`, {
        id_tarea: nuevaTarea.id_tarea,
        descripcion: actividad.descripcion,
        id_estado_tarea: actividad.id_estado_tarea
      });
    }

    // 3. Limpiar formulario y recargar
    limpiarFormulario();
    await cargarTareasPracticante();
    await actualizarEstadisticasPracticante();
    
    mostrarAlerta(`Tarea "${nuevaTarea.nom_tarea}" creada con ${actividades.length} actividad(es) asignada(s) para ${selectedPracticanteName}`, 'success');
  } catch (error) {
    console.error('Error asignando tarea:', error);
    mostrarAlerta('Error al asignar la tarea: ' + (error.response?.data?.message || error.message), 'danger');
  }
});

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('taskForm').reset();
  
  // Limpiar actividades
  const actividadesContainer = document.getElementById('actividadesContainer');
  actividadesContainer.innerHTML = `
    <div id="sinActividadesMsg" class="empty-state">
      <i class="bi bi-info-circle"></i>
      <p class="mb-0">No hay actividades agregadas. Haga clic en "Agregar Actividad" para comenzar.</p>
    </div>
  `;
  
  // Reiniciar contador y agregar primera actividad
  actividadCounter = 0;
  agregarActividad();
}

// Eliminar tarea
async function eliminarTarea(idTarea) {
  if (!confirm('¿Está seguro de eliminar esta tarea?\n\nEsta acción eliminará también todas las actividades asociadas.')) return;

  try {
    await axios.delete(`${API_URL}/tareas/${idTarea}`);
    await cargarTareasPracticante();
    await actualizarEstadisticasPracticante();
    mostrarAlerta('Tarea y sus actividades eliminadas correctamente', 'success');
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    mostrarAlerta('Error al eliminar la tarea: ' + (error.response?.data?.message || error.message), 'danger');
  }
}

// Validación de fechas en tiempo real
document.getElementById('taskStart').addEventListener('change', function() {
  const fechaIni = this.value;
  const fechaFin = document.getElementById('taskEnd');
  if (fechaIni) {
    fechaFin.min = fechaIni;
    if (fechaFin.value && fechaFin.value < fechaIni) {
      fechaFin.value = fechaIni;
    }
  }
});