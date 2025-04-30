import { validateNodes } from '../scripts/validaNodos.js';
import { handleScrollSwitchChange, handleScrollSizeInputChange, clearComparisonResult } from '../scripts/config.js';
import { mostrarAccordionDummy, mostrarAccordionConsultaNumero, mostrarAccordionPago } from './indexDinamico.js';

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

        // Establecemos el valor de la fecha actual sin la hora
        fechaActual.setHours(0, 0, 0, 0);

        // Verificamos si la fecha es inválida (NaN)
        if (isNaN(fechaSeleccionada)) {
            console.log('Fecha inválida', isNaN(fechaSeleccionada)); // Mensaje de error en consola
            return false; // Retornamos false si la fecha es inválida
        }

        // Si la fecha seleccionada es menor o igual a la fecha actual, mostramos el mensaje de error
        if (fechaSeleccionada <= fechaActual) {
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
    //     actualizarEstadoMetodoWebService();
    // });

    listaTipoWebService.addEventListener('change', function () {
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

    });

    // Validamos la fecha cada vez que cambia la fecha de vencimiento
    fechaVencimientoCertificado.addEventListener('change', function () {
        validarFecha();
    });

    // Función para validar todo el formulario y mostrar el alert si está correctamente diligenciado
    formRequerimiento.addEventListener('submit', function (event) {

        if (!formRequerimiento.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            formRequerimiento.classList.add("was-validated");
            alert("Por favor completa correctamente los campos obligatorios.");
        } else {
            event.preventDefault();
            // event.stopPropagation();
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

    const metodoConfig = {
        VerificarEstadoWebService: {
            accordionFn: mostrarAccordionDummy,
            tableId: 'xmlTable',
            tablaLabel: 'Tabla 1'
        },
        ConsultaFacturaPorNumero: {
            accordionFn: mostrarAccordionConsultaNumero,
            tableId: 'xmlTable2',
            tablaLabel: 'Tabla 2'
        },
        RegistrarPagoIFX: {
            accordionFn: mostrarAccordionPago,
            tableId: 'xmlTable3',
            tablaLabel: 'Tabla 3'
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
        console.log('Creando tbody');
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
            // Sin cambios
            break;

        case 'Homologar':
            // Copia col. 7 → col. 3
            activeTable.cell(rowIndex, cellIndex).data(contentNode);
            break;

        case 'Formatear':
            // Sin cambios
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