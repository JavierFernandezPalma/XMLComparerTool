const apiGestionPracticantesUrl = 'https://xmlcomparertool.onrender.com';
const API_URL = `${apiGestionPracticantesUrl}/api/v1`;
let usuarios = [];

// Cargar usuarios al iniciar
async function cargarUsuarios() {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    usuarios = await res.json();

    const select = document.getElementById('usuariosSelect');
    
    // Limpiar opciones existentes (excepto la primera)
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }
    
    // Agregar usuarios al select
    usuarios.forEach(u => {
      const option = document.createElement('option');
      option.value = u.id_usuario;
      option.textContent = `${u.nom_usuario} (${u.nom_roll})`;
      option.setAttribute('data-nombre', u.nom_usuario);
      select.appendChild(option);
    });
    
    console.log('Usuarios cargados correctamente:', usuarios.length);
    
  } catch (err) {
    console.error('Error cargando usuarios:', err);
    mostrarError('No se pudieron cargar los usuarios. Verifica que el servidor esté ejecutándose.');
  }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
  // Crear alerta Bootstrap
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  alertDiv.innerHTML = `
    <strong>Error:</strong> ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Acción al presionar ingresar
function ingresar() {
  const select = document.getElementById('usuariosSelect');
  const id = select.value;
  
  if (!id) {
    mostrarError('Por favor selecciona un usuario');
    return;
  }

  const usuario = usuarios.find(u => u.id_usuario == id);
  if (!usuario) {
    mostrarError('Usuario no encontrado');
    return;
  }

  // Guardar información del usuario en localStorage
  const usuarioInfo = {
    id: usuario.id_usuario,
    nombre: usuario.nom_usuario,
    rol: usuario.nom_roll
  };
  
  localStorage.setItem('usuarioActual', JSON.stringify(usuarioInfo));
  
  console.log('Usuario guardado:', usuarioInfo);

  // Redirigir según el rol
  const rol = usuario.nom_roll.toLowerCase();
  if (rol === 'practicante') {
    window.location.href = 'menuPracticante.html';
  } else {
    window.location.href = 'menuAsignador.html';
  }
}

// Manejar la tecla Enter en el select
document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('usuariosSelect');
  if (select) {
    select.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        ingresar();
      }
    });
  }
});

// Llamar a cargar usuarios al abrir la página
window.onload = cargarUsuarios;

// También cargar usuarios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarUsuarios);