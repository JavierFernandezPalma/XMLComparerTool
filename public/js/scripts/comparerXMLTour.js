// import Shepherd from '/node_modules/shepherd.js';
// import '/node_modules/shepherd.js/dist/css/shepherd.css';

window.startTourComparerXML = function startTour() {

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
        title: 'Cargar archivos',
        text: 'Aquí cargas archivos XML o ingrésalos manualmente en los TextAreas para comparar.',
        attachTo: {
            element: '#inputFiles',
            on: 'bottom' // top, top-start, top-end, left, right, left-start, left-end, right-start, right-end, bottom, bottom-start, bottom-end.
        },
        classes: 'shepherd-theme-dark',
        buttons: [
            {
                text: 'Siguiente (1/5)',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-2',
        title: 'Tipo comparación',
        text: 'Aquí puedes seleccionar el tipo de diferencia a comparar.',
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
        title: 'TextAreas de contenido XML',
        text: 'Aquí visualice e interactúe con las estructuras XML a comparar.',
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
        title: 'Card de resultados',
        text: 'Aquí visualizas los resultados de la comparación.',
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
                text: 'Finalizar (5/5)',
                action: tour.complete
            }
        ]
    });

    tour.start();
};
