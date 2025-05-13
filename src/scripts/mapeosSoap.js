import { validateNodes } from '../scripts/validaNodos.js';
import { clearComparisonResult } from '../scripts/config.js';
import { mostrarAccordionDummyoRequest, mostrarAccordionConsultaNumeroRequest, mostrarAccordionPagoRequest, mostrarAccordionDummyResponse, mostrarAccordionConsultaNumeroResponse, mostrarAccordionPagoResponse } from './indexDinamico.js';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    const listaTipoWebService = document.getElementById('listaTipoWebService');
    const metodoWebService = document.getElementById('metodoWebService');
    const fechaVencimientoCertificado = document.getElementById('fechaVencimientoCertificado');
    const fechaError = document.getElementById('fechaError');
    const formRequerimiento = document.getElementById('formRequerimiento');

    const opcionesLista2 = {
        "una-via": ["VerificarEstadoWebService", "RegistrarPagoIFX"],
        "dos-vias": [
            "VerificarEstadoWebService",
            "ConsultaFacturaPorNumero",
            "ConsultarFacturasPorNit",
            "ConsultarFacturasPoNegocio",
            "RegistrarPagoIFX"
        ]
    };

    // Función para validar la fecha
    function validarFecha() {
        const fechaSeleccionada = new Date(fechaVencimientoCertificado.value);
        const fechaActual = new Date();

        // Crear nueva fecha sumando un mes
        const fechaMasUnMes = new Date(fechaActual);
        fechaMasUnMes.setMonth(fechaActual.getMonth() + 1);

        // Establecemos el valor de la fecha actual sin la hora
        fechaMasUnMes.setHours(0, 0, 0, 0);

        // Verificamos si la fecha es inválida (NaN)
        if (isNaN(fechaSeleccionada)) {
            // console.log('Fecha inválida', isNaN(fechaSeleccionada)); // Mensaje de error en consola
            return false; // Retornamos false si la fecha es inválida
        }

        // Si la fecha seleccionada es menor o igual a la fecha actual, mostramos el mensaje de error
        if (fechaSeleccionada <= fechaMasUnMes) {
            fechaError.style.display = 'inline';  // Mostrar el mensaje de error
            fechaVencimientoCertificado.value = '';  // Borrar el valor del campo de fecha
            return false; // Retornamos false si la fecha no es válida
        } else {
            fechaError.style.display = 'none';  // Ocultar el mensaje de error
            return true; // Retornamos true si es válida
        }
    }

    // Función para habilitar/deshabilitar el campo 'metodoWebService'
    function actualizarEstadoMetodoWebService() {
        // Primero, validar la fecha
        if (!validarFecha()) {
            return; // Si la fecha no es válida, no ejecutamos el resto
        }
        const seleccion = listaTipoWebService.value;
        metodoWebService.innerHTML = ''; // Limpiar opciones anteriores

        if (opcionesLista2[seleccion]) {
            metodoWebService.disabled = false;

            // Agregar opción por defecto
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = 'Selecciona una operación';
            metodoWebService.appendChild(placeholder);

            // Agregar nuevas opciones
            opcionesLista2[seleccion].forEach(op => {
                const option = document.createElement('option');
                option.value = op;
                option.textContent = op;
                metodoWebService.appendChild(option);
            });
        } else {
            metodoWebService.disabled = true;
            metodoWebService.innerHTML = '<option>Primero selecciona tipo WS</option>';
        }
    }
    // // Evento global para escuchar cambios en cualquier campo de entrada dentro del formulario
    // formRequerimiento.addEventListener('focusout', function (event) {
    //     console.log('Cambio en el formulario:', event.target.id); // Mensaje de depuración
    //     // Si se modifica cualquier campo dentro del formulario, se valida el estado de 'metodoWebService'
    //     // actualizarEstadoMetodoWebService();
    // });

    // listaTipoWebService.addEventListener('change', function () {
    //     // Primero, validar la fecha
    //     if (!validarFecha()) {
    //         return; // Si la fecha no es válida, no ejecutamos el resto
    //     }
    //     const seleccion = listaTipoWebService.value;
    //     metodoWebService.innerHTML = ''; // Limpiar opciones anteriores

    //     if (opcionesLista2[seleccion]) {
    //         metodoWebService.disabled = false;

    //         // Agregar opción por defecto
    //         const placeholder = document.createElement('option');
    //         placeholder.value = '';
    //         placeholder.disabled = true;
    //         placeholder.selected = true;
    //         placeholder.textContent = 'Selecciona una operación';
    //         metodoWebService.appendChild(placeholder);

    //         // Agregar nuevas opciones
    //         opcionesLista2[seleccion].forEach(op => {
    //             const option = document.createElement('option');
    //             option.value = op;
    //             option.textContent = op;
    //             metodoWebService.appendChild(option);
    //         });
    //     } else {
    //         metodoWebService.disabled = true;
    //         metodoWebService.innerHTML = '<option>Primero selecciona tipo WS</option>';
    //     }

    // });

    // Validamos la fecha cada vez que cambia la fecha de vencimiento
    fechaVencimientoCertificado.addEventListener('change', function () {
        validarFecha();
    });

    // Función para validar todo el formulario y mostrar el alert si está correctamente diligenciado
    formRequerimiento.addEventListener('submit', function (event) {
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

        // Función para crear y mostrar alertas
        const appendAlert = (message, type, duration = 4000) => {
            // Eliminar alertas existentes
            alertPlaceholder.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = `alert alert-${type} alert-dismissible fade show`;
            wrapper.role = 'alert';
            wrapper.innerHTML = `
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

            alertPlaceholder.appendChild(wrapper);

            // Cerrar automáticamente después de `duration` ms
            setTimeout(() => {
                const alert = bootstrap.Alert.getOrCreateInstance(wrapper);
                alert.close();
            }, duration);
        };

        if (!formRequerimiento.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            formRequerimiento.classList.add("was-validated");
            appendAlert('Por favor completa correctamente los campos obligatorios.', 'danger');
        } else {
            event.preventDefault();
            appendAlert('Formulario diligenciado correctamente.', 'success');
            actualizarEstadoMetodoWebService();
        }
    });

});

let xmlTable, xmlTable2, xmlTable3; // Variables globales para las tablas

/**
 * Carga y renderiza los datos en la tabla seleccionada.
 */
document.getElementById('cargarMapeos').addEventListener('click', () => {
    clearComparisonResult();

    const xmlData1 = window.editor1.getValue();
    const xmlData2 = window.editor2.getValue();
    const tipoWS = document.getElementById('listaTipoWebService').value;
    const metodoWS = document.getElementById('metodoWebService').value;

    const radios = document.querySelectorAll('input[name="tipoMapeo"]');
    // Buscar el radio actualmente seleccionado para colocar el tipo de mapeo en el nombre del Modal
    const tipoMapeo = Array.from(radios).find(radio => radio.checked);

    const metodoConfig = {
        VerificarEstadoWebService: {
            accordionFn: tipoMapeo.value === 'Request'
                ? mostrarAccordionDummyoRequest
                : mostrarAccordionDummyResponse,
            tableId: tipoMapeo.value === 'Request'
                ? 'xmlTable'
                : 'xmlTable6',
            tablaLabel: tipoMapeo.value === 'Request'
                ? 'Tabla 1'
                : 'Tabla 6'
        },
        ConsultaFacturaPorNumero: {
            accordionFn: tipoMapeo.value === 'Request'
                ? mostrarAccordionConsultaNumeroRequest
                : mostrarAccordionConsultaNumeroResponse,
            tableId: tipoMapeo.value === 'Request'
                ? 'xmlTable2'
                : 'xmlTable7',
            tablaLabel: tipoMapeo.value === 'Request'
                ? 'Tabla 2'
                : 'Tabla 7'
        },
        RegistrarPagoIFX: {
            accordionFn: tipoMapeo.value === 'Request'
                ? mostrarAccordionPagoRequest
                : mostrarAccordionPagoResponse,
            tableId: tipoMapeo.value === 'Request'
                ? 'xmlTable3'
                : 'xmlTable8',
            tablaLabel: tipoMapeo.value === 'Request'
                ? 'Tabla 3'
                : 'Tabla 8'
        }
    };

    const config = metodoConfig[metodoWS];
    if (!config) {
        alert('Por favor selecciona una operación válida.');
        return;
    }

    // Mostrar acordeón solo si no existe ya
    if (!document.getElementById(config.tableId)) {
        config.accordionFn();
    }

    const $table = $(`#${config.tableId}`);
    const tableElement = document.getElementById(config.tableId);

    // Reinicializar tabla si ya existe
    if ($.fn.dataTable.isDataTable(`#${config.tableId}`)) {
        $table.DataTable().destroy();
        $table.empty();
    }

    const { headers, rows } = validateNodes(xmlData1, xmlData2);
    if (!tipoWS || !metodoWS) return;

    const columnDefs = headers.map(title => ({ title }));

    // Crear o actualizar tbody
    let tbody = document.querySelector(`#${config.tableId} #tableBody`);
    if (!tbody) {
        // Crear el tbody si no existe
        tbody = document.createElement('tbody');
        tbody.id = config.tableId + '-body';;
        tableElement.appendChild(tbody);
    }

    // Construcción de filas HTML
    tbody.innerHTML = rows.map((row, rowIndex) =>
        `<tr>${row.map((cell, cellIndex) => {
            const id = `cell-${rowIndex}-${cellIndex}`;
            const clase = cell.includes('<select') ? 'columna-select'
                : cell.includes('<input') ? 'columna-text'
                    : cell.includes('<span') ? 'columna-span'
                        : '';
            return `<td ${clase ? `class="${clase}"` : ''} id="${id}">${cell}</td>`;
        }).join('')}</tr>`
    ).join('');

    $table.show();

    const datatable = $table.DataTable({
        destroy: true,
        columns: columnDefs,
        select: { style: 'os', items: 'cell' },
        autoWidth: false,
        paging: true,
        processing: true,
        scrollX: true,
        colReorder: true,
        stateSave: false,
        dom: 'Bfrtip',
        buttons: ['pageLength', 'colvis']
    });

    // Asignar instancia a la variable global
    window[config.tableId] = datatable;
    configurarEventosTabla(datatable, config.tablaLabel);

    $('#container').css('display', 'block');
    datatable.columns.adjust().draw();

});

/**
 * Actualiza col. URL (5) y contenido nodo (7) según selección en tabla.
 *
 * @param {HTMLSelectElement} selectElement - <select> con URL.
 * @param {number} rowIndex - Fila afectada.
 * @param {string} tablaContext - ID de tabla ('xmlTable' por defecto).
 *
 * Función:
 * - Toma valor y texto del <select>.
 * - Busca celdas col. 5 (URL) y col. 7 (contenido nodo).
 * - Asigna valores a tabla activa.
 * - Habilita <select> de acciones si hay URL válida.
 */
window.actualizarUrlSeleccionado = function (selectElement, rowIndex, tablaContext = 'xmlTable') {

    const selectedUrl = selectElement.value;
    const selectedText = selectElement.options[selectElement.selectedIndex].getAttribute('data-text');

    const tableId = selectElement.closest('table')?.id;
    const activeTable = window[tableId];
    if (!activeTable) return;

    // Busca celdas col. 5 (URL) y col. 7 (contenido nodo)
    // y asigna valores a tabla activa
    const outputCol = 5, sourceCol = 7;
    const cellUrl = document.querySelector(`#${tableId} #cell-${rowIndex}-${outputCol}`);
    const cellNodeContent = document.querySelector(`#${tableId} #cell-${rowIndex}-${sourceCol}`);


    if (cellUrl && cellNodeContent) {
        const columnUrlIndex = cellUrl.cellIndex;
        const columnNodeContentIndex = cellNodeContent.cellIndex;

        // Setea URL y contenido nodo en tabla
        activeTable.cell(rowIndex, columnUrlIndex).data(selectedUrl);
        activeTable.cell(rowIndex, columnNodeContentIndex).data(selectedText);
    }

    // Habilita <select> de acción si hay URL
    const accionSelectId = `${tableId}-list1_${rowIndex}`;
    const actionSelect = document.getElementById(accionSelectId);
    if (actionSelect) actionSelect.disabled = !selectedUrl;
};



/**
 * Actualiza col. 3 según acción del <select> en una fila.
 *
 * @param {HTMLSelectElement} selectElement - <select> con opción elegida.
 * @param {number} rowIndex - Índice de fila.
 * @param {string} tablaContext - ID de tabla ('xmlTable' por defecto).
 *
 * Función:
 * - Usa tabla activa (table o table2).
 * - Si "Homologar": copia col. 7 a col. 3.
 * - Si "Asignar valor por defecto": muestra <textarea> en col. 3.
 * - Otras opciones: sin acción.
 */
window.actualizarAccionSeleccionada = function (selectElement, rowIndex, tablaContext = 'xmlTable') {

    const tableId = selectElement.closest('table')?.id;
    const activeTable = window[tableId];
    if (!activeTable) return;

    const outputCol = 3, sourceCol = 7;
    const contentNode = activeTable.cell(rowIndex, sourceCol).data();
    const cell = document.querySelector(`#${tableId} #cell-${rowIndex}-${outputCol}`);
    const cellIndex = cell.cellIndex;

    switch (selectElement.value) {
        case 'No aplica':
            activeTable.cell(rowIndex, cellIndex).data('No aplica');
            break;

        case 'Homologar':
            // Copia col. 7 → col. 3
            activeTable.cell(rowIndex, cellIndex).data(contentNode);
            break;

        case 'Formatear':
            // // Obtener el shadowRoot del modal 'modalCausa'
            // const shadowRoot = obtenerShadowRootModal('modalSolucion');
            // if (!shadowRoot) {
            //     console.error('No se encontró el modal con el id "modalSolucion".');
            //     return; // Si no se encuentra el modal, se termina la ejecución
            // }

            // // Asignar valores a los inputs del modal
            // asignarValoresAInputs(shadowRoot, {
            //     idSolucion: 23,       // Asignar el ID de la causa
            //     descripcionSolucion: "Prueba", // Asignar la descripción del error
            //     descripcionCausaSolucion: "Prueba 2" // Asignar la descripción de la causa
            // }, ['idSolucion', 'descripcionCausaSolucion']); // Deshabilitar los inputs de 'idError' y 'descripcionError'

            // // Mostrar el modal
            // mostrarModal(shadowRoot, 'modalSolucion');

            const modalElement = document.getElementById('modalFormatoDatos');
            const modal = new bootstrap.Modal(modalElement);
            modalElement.querySelector('#contenidoNodo').value = contentNode;
            // Guardar datos en atributos data-*
            modalElement.dataset.rowIndex = rowIndex;
            modalElement.dataset.cellIndex = cellIndex;
            modalElement.dataset.tableId = tableId;
            modal.show();
            break;

        case 'Asignar valor por defecto':
            // Reemplaza col. 3 con <textarea>
            const td = document.querySelector(`#${tableId} #cell-${rowIndex}-${outputCol}`);
            if (!td) break;

            const inputArea = document.createElement('textarea');
            Object.assign(inputArea, {
                id: `${tableId}-fourth-column-${rowIndex}`,
                placeholder: "Ingresa valor",
                disabled: false,
                title: "Por favor, ingresa el valor requerido aquí"
            });
            inputArea.className = 'form-control';
            td.innerHTML = '';
            td.appendChild(inputArea);
            $(inputArea).tooltip({ trigger: 'focus' });
            inputArea.focus();
            break;

        case 'Nulo':
            activeTable.cell(rowIndex, cellIndex).data('Null');
            break;

        default:
            // Sin cambios
            break;
    }
}

/**
 * Función para obtener el componente <modal-xml> y su shadowRoot basado en el id del modal.
 * 
 * @param {string} modalId - El id del modal a buscar dentro de los elementos <modal-xml>.
 * @returns {ShadowRoot|null} - El shadowRoot del modal encontrado o null si no se encuentra.
 */
function obtenerShadowRootModal(modalId) {
    const modalXML = Array.from(document.querySelectorAll('modal-xml'))
        .find(modal => modal.shadowRoot && modal.shadowRoot.getElementById(modalId));

    return modalXML ? modalXML.shadowRoot : null;
}

/**
 * Función para asignar valores a los inputs dentro del shadowRoot de un modal.
 * 
 * @param {ShadowRoot} shadowRoot - El shadowRoot donde se encuentran los inputs.
 * @param {Object} valores - Objeto que contiene los valores para asignar a los campos de input.
 * @param {Array<string>} inputsDeshabilitados - Lista de los ids de los inputs que deben ser deshabilitados.
 */
function asignarValoresAInputs(shadowRoot, valores, inputsDeshabilitados = []) {
    Object.keys(valores).forEach(id => {
        const input = shadowRoot.getElementById(id);
        if (input) {
            input.value = valores[id];
            if (inputsDeshabilitados.includes(id)) {
                input.disabled = true; // Deshabilitar los inputs necesarios
            }
        }
    });
}

/**
 * Función para inicializar y mostrar un modal utilizando Bootstrap.
 * 
 * @param {ShadowRoot} shadowRoot - El shadowRoot donde se encuentra el modal.
 * @param {string} modalId - El id del modal a inicializar y mostrar.
 */
function mostrarModal(shadowRoot, modalId) {
    const modalElement = shadowRoot.querySelector(`#${modalId}`);
    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement, {
            keyboard: false // Deshabilitar el cierre con la tecla Escape
        });
        modalInstance.show(); // Mostrar el modal
    }
}

document.querySelector('#formato').addEventListener('change', function () {
    const opcionSeleccionada = this.value;

    const modalElement = document.getElementById('modalFormatoDatos');
    const valor = modalElement.querySelector('#contenidoNodo').value;
    const grupoFormatoFecha = document.getElementById('grupoFormatoFecha');
    const grupoExtraer = document.getElementById('grupoExtraer');

    // Oculta por defecto el grupo de formato fecha
    grupoFormatoFecha.classList.add('d-none');
    // Oculta por defecto el grupo extraer
    grupoExtraer.classList.add('d-none');

    // Actualizar el input "resultadoEsperado" según la opción
    const resultadoInput = document.querySelector('#resultadoEsperado');
    if (opcionSeleccionada === 'quitar-guiones-cerosIzquierda') {
        resultadoInput.value = valor.replace(/-/g, '').replace(/^0+/, '');
    } else if (opcionSeleccionada === 'quitar-decimales') {
        resultadoInput.value = valor.replace(/\.\d+$/, '');
    } else if (opcionSeleccionada === 'agregar-decimal') {
        if (isNaN(valor) || valor.trim() === "") {
            resultadoInput.value = '';
            alert("El valor ingresado no es un número válido.");
        } else {
            resultadoInput.value = Number(valor).toFixed(2);
        }
    } else if (opcionSeleccionada === 'formato-fecha') {
        grupoFormatoFecha.classList.remove('d-none');
    } else if (opcionSeleccionada === 'extraer') {
        grupoExtraer.classList.remove('d-none');
    } else {
        resultadoInput.value = '';
    }
});


/**
 * Maneja el evento de clic en el botón "Aplicar" dentro del modal.
 * - Valida los datos ingresados.
 * - Actualiza la celda seleccionada de una tabla con el resultado formateado.
 * - Limpia los campos del formulario y los atributos data-* del modal.
 * - Cierra el modal de forma accesible.
 */
document.querySelector('#btnAplicarFormato').addEventListener('click', e => {
    e.preventDefault(); // Evita el envío del formulario si está dentro de uno

    const grupoExtraer = document.getElementById('grupoExtraer');
    // Oculta por defecto el grupo extraer
    grupoExtraer.classList.add('d-none');

    const grupoFormatoFecha = document.getElementById('grupoFormatoFecha');
    // Oculta por defecto el grupo de formato fecha
    grupoFormatoFecha.classList.add('d-none');

    // Obtener referencia al modal
    const modalEl = document.getElementById('modalFormatoDatos');

    // Extraer índices de fila, columna y ID de tabla desde atributos data-*
    const { rowIndex, cellIndex, tableId } = modalEl.dataset;

    // Obtener el valor seleccionado del formato y el resultado calculado
    const formato = document.querySelector('#formato').value;
    const resultado = document.querySelector('#resultadoEsperado').value;

    // Validar que el resultado no esté vacío
    if (!resultado) return alert('El campo "Resultado esperado" está vacío.');

    // Verificar que la tabla esté disponible en el contexto global
    const table = window[tableId];
    if (!table) return;

    // Actualizar la celda especificada con el texto formateado
    table.cell(rowIndex, cellIndex).data(`${formato}: ${resultado}`);

    // Reiniciar el formulario del modal (campos normales)
    modalEl.querySelector('form').reset();

    // Limpiar manualmente los campos deshabilitados (no los afecta .reset())
    ['contenidoNodo', 'resultadoEsperado'].forEach(id => {
        const input = modalEl.querySelector(`#${id}`);
        if (input) input.value = '';
    });

    // Eliminar atributos data-* para limpiar el estado del modal
    ['rowIndex', 'cellIndex', 'tableId'].forEach(key => delete modalEl.dataset[key]);

    // Restablecer el select "formato" a su opción por defecto
    const modalElement = document.getElementById('modalFormatoDatos');
    const formatoSelect = modalElement.querySelector('#formato');
    formatoSelect.selectedIndex = 0;
});

/**
 * Función que reinicia todos los elementos del modal cuando se hace clic en el botón "Cancelar".
 * 1. Reinicia los campos del formulario.
 * 2. Limpia manualmente los campos deshabilitados.
 * 3. Elimina atributos `data-*` utilizados para almacenar datos temporales.
 * 4. Elimina el foco del botón activo, mejorando la accesibilidad.
 * 5. Cierra el modal correctamente.
 */
document.getElementById('btnCancelarFormato').addEventListener('click', () => {
    const grupoExtraer = document.getElementById('grupoExtraer');
    // Oculta por defecto el grupo extraer
    grupoExtraer.classList.add('d-none');

    const grupoFormatoFecha = document.getElementById('grupoFormatoFecha');
    // Oculta por defecto el grupo de formato fecha
    grupoFormatoFecha.classList.add('d-none');

    const modalElement = document.getElementById('modalFormatoDatos');

    // Reiniciar formulario (los campos del formulario dentro del modal)
    modalElement.querySelector('form').reset();

    // Limpiar manualmente campos deshabilitados (no los afecta .reset())
    modalElement.querySelector('#contenidoNodo').value = '';
    modalElement.querySelector('#resultadoEsperado').value = '';

    // Restablecer el select "formato" a su opción por defecto
    const formatoSelect = modalElement.querySelector('#formato');
    formatoSelect.selectedIndex = 0;

    // Limpiar atributos data-*
    ['rowIndex', 'cellIndex', 'tableId'].forEach(key => delete modalElement.dataset[key]);

});

document.getElementById('formatoFecha').addEventListener('change', function () {
    const opcionSeleccionada = this.value;
    const modalElement = document.getElementById('modalFormatoDatos');
    const valor = modalElement.querySelector('#contenidoNodo').value;
    // Actualizar el input "resultadoEsperado" según la opción
    const resultadoInput = document.querySelector('#resultadoEsperado');


    resultadoInput.value = opcionSeleccionada + ': ' + formatearFecha(valor, opcionSeleccionada);
});


function formatearFecha(isoDate, formato) {
    // Extrae partes de la fecha usando expresión regular
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);

    if (!match) {
        alert("El contenido del nodo no es una fecha válida, se espera YYYY-MM-DDTHH:mm:ss");
        return "";
    }

    // Desestructura las partes extraídas
    const [_, year, month, day, hour, minute, second] = match;

    // Reemplaza los tokens del formato por los valores correspondientes
    return formato
        .replace(/YYYY/, year)
        .replace(/MM/, month)
        .replace(/DD/, day)
        .replace(/HH/, hour)
        .replace(/mm/, minute)
        .replace(/ss/, second);
}

// Referencias a elementos clave del DOM
const modalElement = document.getElementById('modalFormatoDatos');
const resultadoInput = document.querySelector('#resultadoEsperado');
const [extraerInicioInput, extraerFinInput] = [
    document.getElementById('extraerInicio'),
    document.getElementById('extraerFin')
];

/**
 * Escapa caracteres especiales para uso seguro en expresiones regulares.
 * @param {string} str - Texto a escapar.
 * @returns {string} - Texto escapado.
 */
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Extrae el texto entre dos delimitadores.
 * @param {string} texto - Texto fuente.
 * @param {string} inicio - Delimitador inicial.
 * @param {string} fin - Delimitador final (opcional).
 * @returns {string|null} - Texto extraído o null si no hay coincidencia.
 */
const extraerEntre = (texto, inicio, fin) => {
    const pattern = fin
        ? `${escapeRegExp(inicio)}(.*?)${escapeRegExp(fin)}`
        : `${escapeRegExp(inicio)}(.*)`;
    const match = texto.match(new RegExp(pattern));
    return match?.[1] ?? null;
};

/**
 * Evento ejecutado al perder el foco (blur) en campos de extracción.
 * Extrae el contenido entre los valores proporcionados y lo muestra.
 */
const actualizarResultadoExtraido = () => {
    const texto = modalElement.querySelector('#contenidoNodo').value;
    const inicio = extraerInicioInput.value.trim();
    const fin = extraerFinInput.value.trim();

    if (inicio || fin) {
        const resultado = extraerEntre(texto, inicio, fin);
        resultadoInput.value = `${inicio} ${fin}: ${resultado ?? null}`;
    }
};

// Asignar evento blur a ambos campos
[extraerInicioInput, extraerFinInput].forEach(input =>
    input.addEventListener('blur', actualizarResultadoExtraido)
);


// Función para mostrar en consola la celda seleccionada
function configurarEventosTabla(tabla, nombreTabla) {
    // tabla.on('select', function (e, dt, type, indexes) {
    //     if (type === 'cell') {
    //         const row = indexes[0].row;
    //         const column = indexes[0].column;
    //         console.log(`Se ha seleccionado la celda (${row}, ${column}) de la ${nombreTabla}`);
    //     }
    // });
}