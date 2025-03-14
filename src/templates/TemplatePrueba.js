import logo from '../assets/images/Bancolombiablanco.png'

const TemplatePrueba = async () => {
    // const data = await getData();
    const view = `
    <div class="container my-5">

        <!-- Título de la página -->
        <h2 class="text-center mb-4">Comparar Estructuras XML</h2>

        <!-- Card para cargar archivos XML -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="card-title">Cargar archivos XML para comparar</h4>
                    <!-- Contenedor para el botón de tour -->
                    <div class="d-flex align-items-center">
                        <!-- Botón para iniciar el paseo -->
                        <button onclick="startTourComparerXML()" class="btn btn-primary btn-circle"
                            type="button">?</button>
                    </div>
                </div>
                <!-- Input para cargar archivo XML base -->
                <div id="inputFiles">
                    <div class="mb-3">
                        <label for="fileInput1" class="form-label">Seleccionar archivo XML Base</label>
                        <input type="file" class="form-control" id="fileInput1" accept=".xml">
                    </div>
                    <!-- Input para cargar archivo XML a comparar -->
                    <div class="mb-3">
                        <label for="fileInput2" class="form-label">Seleccionar archivo XML a comparar</label>
                        <input type="file" class="form-control" id="fileInput2" accept=".xml">
                    </div>
                </div>
                <!-- Select para seleccionar archivo XML desde una lista -->
                <div class="mb-3">
                    <label for="xmlFileSelect" class="form-label">Seleccionar archivo XML desde una lista</label>
                    <select class="form-select" id="xmlFileSelect">
                        <option value="">Seleccionar archivo XML</option>
                    </select>
                </div>
                <!-- Radio buttons para seleccionar tipo de diferencia -->
                <div id="radioButtons">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                            checked>
                        <label class="form-check-label" for="flexRadioDefault1">Diferencias XML</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                        <label class="form-check-label" for="flexRadioDefault2">Diferencias nodos XML</label>
                    </div>
                </div>
                <!-- Accordion para secciones de eliminar y subir archivos XML -->
                <div class="accordion accordion-flush mt-4" id="accordionFlushExample">
                    <!-- Template para eliminar archivos XML -->
                    <template id="templateEliminarArchivosXML">

                        <!-- Sección de eliminar archivos XML -->
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="flush-headingOne">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseOne" aria-expanded="false"
                                    aria-controls="flush-collapseOne">
                                    <!-- El texto del botón será modificado dinámicamente por el script -->
                                </button>
                            </h2>
                            <div id="flush-collapseOne" class="accordion-collapse collapse"
                                aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                <div class="accordion-body">
                                    <form id="deleteForm" class="d-flex">
                                        <select class="form-select me-2" id="deleteFileSelect" required></select>
                                        <button type="submit" class="btn btn-danger">Eliminar</button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </template>

                    <!-- Contenedor donde se insertará el template de eliminar archivos XML -->
                    <div id="containerEliminarArchivosXML"></div>

                    <!-- Template para subir archivos XML -->
                    <template id="templateSubirArchivosXML">
                        <!-- Sección de subir archivos XML -->
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="flush-headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseTwo" aria-expanded="false"
                                    aria-controls="flush-collapseTwo">
                                    <!-- El texto del botón será modificado dinámicamente por el script -->
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" class="accordion-collapse collapse"
                                aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div class="accordion-body">
                                    <form id="uploadForm" enctype="multipart/form-data" class="d-flex">
                                        <input type="file" class="form-control me-2" id="fileInput" name="file"
                                            accept=".xml" required>
                                        <button type="submit" class="btn btn-primary">Subir</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Contenedor donde se insertará el template de subir archivos XML -->
                    <div id="containerSubirArchivosXML"></div>
                </div>
                <!-- Fin del Accordion -->
            </div>
        </div>

        <!-- Card para ingresar XML manualmente -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="card-title mb-0">Ingresar XML manualmente</h4>
                    <div id="switchScroll" class="d-flex align-items-center">
                        <!-- Switch para activar/desactivar el scroll vertical -->
                        <div class="form-check form-switch me-3">
                            <input class="form-check-input" type="checkbox" id="scrollSwitch"
                                title="Activar Scroll Vertical">
                            <label class="form-check-label d-none d-md-flex" for="scrollSwitch">Activar Scroll
                                Vertical</label>
                        </div>
                        <!-- Campo de texto para el tamaño del scroll -->
                        <div>
                            <input type="number" class="form-control" id="scrollSizeInput" list="presetScrollSizes"
                                min="1" pattern="\d*" disabled title="Ingrese el tamaño del scroll en píxeles">
                            <datalist id="presetScrollSizes">
                                <option value="100">
                                <option value="200">
                                <option value="300">
                                <option value="400">
                                <option value="500">
                                <option value="1000">
                            </datalist>
                        </div>
                    </div>
                </div>

                <!-- Textareas para comparar estructuras XML -->
                <div id="textAreasComparar" class="row">
                    <!-- Textarea para XML base -->
                    <div class="col-md-6 mb-3">
                        <label for="xmlInput1" class="form-label">XML Base</label>
                        <textarea class="form-control" id="xmlInput1" rows="10"></textarea>
                        <div class="d-flex justify-content-end mt-2">
                            <button id="formatXmlInput1" class="btn btn-secondary me-2">Aplicar Formato</button>
                            <button id="clearXmlInput1" class="btn btn-warning">Limpiar XML 1</button>
                        </div>
                    </div>
                    <!-- Textarea para XML a comparar -->
                    <div class="col-md-6 mb-3">
                        <label for="xmlInput2" class="form-label">XML a Comparar</label>
                        <textarea class="form-control" id="xmlInput2" rows="10"></textarea>
                        <div class="d-flex justify-content-end mt-2">
                            <button id="formatXmlInput2" class="btn btn-secondary me-2">Aplicar Formato</button>
                            <button id="clearXmlInput2" class="btn btn-warning">Limpiar XML 2</button>
                        </div>
                    </div>
                </div>

                <!-- Botón para comparar XML -->
                <div class="text-center">
                    <button id="compareButton" class="btn btn-success">Comparar</button>
                </div>
            </div>
        </div>

        <!-- Card para mostrar el resultado de la comparación -->
        <div id="cardResultComparer" class="card">
            <div class="card-body">
                <h4 class="card-title">Comparación de estructuras XML</h4>
                <!-- Resultado de la comparación -->
                <pre id="comparisonResult" class="diff p-3 bg-light rounded"></pre>
                <div id="messageContainer" class="diff p-3 bg-light rounded"></div>
            </div>
        </div>
    </div>
    `;
    return view;
};

export default TemplatePrueba;