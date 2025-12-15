window.startTourValidateXML = function startTour() {

    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            classes: 'shepherd-theme-dark',
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
        title: 'Scroll vertical',
        text: 'Aquí puedes activar y modificar el scroll vertical.',
        attachTo: {
            element: '#switchScroll',
            on: 'bottom-end' // top, top-start, top-end, left, right, left-start, left-end, right-start, right-end, bottom, bottom-start, bottom-end.
        },
        classes: 'shepherd-theme-dark',
        buttons: [
            {
                text: 'Siguiente (1/4)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-2',
        title: 'XML a validar',
        text: 'Aquí ingresas estructura XML a validar.',
        attachTo: {
            element: '#xmlValitate',
            on: 'bottom'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Siguiente (2/4)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-3',
        title: 'Esquema validador',
        text: 'Aquí ingresas la estructura XML (XSD) para validar.',
        attachTo: {
            element: '#schemaValidate',
            on: 'bottom'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Siguiente (3/4)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-5',
        title: 'Card de resultados',
        text: 'Aquí visualizas los resultados de la validación.',
        attachTo: {
            element: '#cardResultComparer',
            on: 'top'
        },
        buttons: [
            {
                text: 'Anterior',
                action: tour.back
            },
            {
                text: 'Finalizar (4/4)',
                action: tour.complete
            }
        ]
    });

    tour.start();
};
