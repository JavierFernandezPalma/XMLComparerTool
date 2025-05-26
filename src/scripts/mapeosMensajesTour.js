window.startTourMapeosMensajes = function startTour() {

    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            classes: 'shepherd-theme-custom',
            scrollTo: { behavior: 'smooth', block: 'center' }, // Configuración de desplazamiento suave
            cancelIcon: {
                enabled: true, // Muestra un icono para cancelar el tour
                label: 'Cancel Tour' // Texto alternativo para el icono
            }
        },
        useModalOverlay: true,
        exitOnEsc: true,
        exitOnOverlayClick: true,
        keyboardNavigation: true,
        showCancelLink: true,
        confirmCancel: false
    });

    tour.addStep({
        id: 'step-1',
        title: 'Formulario Cliente RIN-RTR',
        text: 'Requerido: para WS estándar se requiere con pruebas, y para no estándar también mapeos. Contiene campo opcional para agregar descripción adicional y tabla para registrar facturas de prueba.',
        attachTo: {
            element: '#formRequerimiento',
            on: 'bottom' // top, top-start, top-end, left, right, left-start, left-end, right-start, right-end, bottom, bottom-start, bottom-end.
        },
        buttons: [
            {
                text: 'Siguiente (1/5)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-2',
        title: 'Tipo de Mapeo y Método',
        text: 'Aquí selecciona el tipo de mapeo y el método a mapear. Este paso es requerido.',
        attachTo: {
            element: '#radioButtons',
            on: 'bottom'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Siguiente (2/5)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-3',
        title: 'Scroll vertical',
        text: 'Aquí puedes activar y modificar el scroll vertical.',
        attachTo: {
            element: '#switchScroll',
            on: 'bottom'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Siguiente (3/5)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-4',
        title: 'Estructuras de Banco y Cliente',
        text: 'Carga y edita las estructuras XML del Banco y XML/JSON del Cliente para los mapeos de mensajería.',
        attachTo: {
            element: '#textAreasComparar',
            on: 'top'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Siguiente (4/5)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-5',
        title: 'Cargar y Guardar Mapeos',
        text: 'Desde aquí puedes cargar y guardar los mapeos de mensajes SOAP y SOAP/REST.',
        attachTo: {
            element: '#botonesAccion',
            on: 'bottom'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Finalizar (5/5)',
                action: tour.complete
            }
        ]
    });

    tour.start();
};
