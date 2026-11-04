document.addEventListener('DOMContentLoaded', () => {
    // Referencias de todas las pantallas
    const screenLogin = document.getElementById('screen-login');
    const screenRecuperar = document.getElementById('screen-recuperar-pass');
    const screenNuevoUsuario = document.getElementById('screen-nuevo-usuario');
    const screenConsultarLegajo = document.getElementById('screen-consultar-legajo');
    
    const screenHome = document.getElementById('screen-home');
    const screenCmao = document.getElementById('screen-cmao');
    const screenTurno = document.getElementById('screen-turno');
    const screenComprobanteTurno = document.getElementById('screen-comprobante-turno');
    const screenConsultas = document.getElementById('screen-consultas');
    const screenDeuda = document.getElementById('screen-deuda');
    const screenContratos = document.getElementById('screen-contratos');
    const screenFormularios = document.getElementById('screen-formularios');

    // Variables de seguimiento para volver a la pantalla anterior
    let pantallaOrigenCmao = screenHome;
    let pantallaOrigenConsultas = screenHome;

    // --- 0. Lógica de Inicio de Sesión, Recuperar Pass, Nuevo Usuario y Legajo ---
    
    const loginForm = document.getElementById('login-form');
    
    // Formularios Secundarios
    const recuperarForm = document.getElementById('recuperar-form');
    const nuevoUsuarioForm = document.getElementById('nuevo-usuario-form');
    const consultarLegajoForm = document.getElementById('consultar-legajo-form');
    const resultadoLegajo = document.getElementById('resultado-legajo');

    // Botones de Navegación del Login
    const linkRecuperar = document.getElementById('link-recuperar');
    const linkNuevoUsuario = document.getElementById('link-nuevo-usuario');
    const linkConsultarLegajo = document.getElementById('link-consultar-legajo');
    
    // Botones 'Volver' hacia el Login
    const btnBackRecuperar = document.getElementById('btn-back-recuperar');
    const btnBackNuevoUsuario = document.getElementById('btn-back-nuevo-usuario');
    const btnBackConsultarLegajo = document.getElementById('btn-back-consultar-legajo');

    // Login Principal
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            screenLogin.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    // Navegación desde Enlaces del Login
    if (linkRecuperar && screenRecuperar) {
        linkRecuperar.addEventListener('click', (e) => {
            e.preventDefault();
            screenLogin.classList.remove('active');
            screenRecuperar.classList.add('active');
        });
    }

    if (linkNuevoUsuario && screenNuevoUsuario) {
        linkNuevoUsuario.addEventListener('click', (e) => {
            e.preventDefault();
            screenLogin.classList.remove('active');
            screenNuevoUsuario.classList.add('active');
        });
    }

    if (linkConsultarLegajo && screenConsultarLegajo) {
        linkConsultarLegajo.addEventListener('click', (e) => {
            e.preventDefault();
            if (resultadoLegajo) resultadoLegajo.style.display = 'none';
            if (consultarLegajoForm) consultarLegajoForm.reset();
            screenLogin.classList.remove('active');
            screenConsultarLegajo.classList.add('active');
        });
    }

    // Botones Volver hacia Login
    if (btnBackRecuperar && screenRecuperar) {
        btnBackRecuperar.addEventListener('click', () => {
            screenRecuperar.classList.remove('active');
            screenLogin.classList.add('active');
        });
    }

    if (btnBackNuevoUsuario && screenNuevoUsuario) {
        btnBackNuevoUsuario.addEventListener('click', () => {
            screenNuevoUsuario.classList.remove('active');
            screenLogin.classList.add('active');
        });
    }

    if (btnBackConsultarLegajo && screenConsultarLegajo) {
        btnBackConsultarLegajo.addEventListener('click', () => {
            screenConsultarLegajo.classList.remove('active');
            screenLogin.classList.add('active');
        });
    }

    // Envío de Formularios Secundarios
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Se envió la contraseña al mail indicado');
            recuperarForm.reset();
            screenRecuperar.classList.remove('active');
            screenLogin.classList.add('active');
        });
    }

    if (nuevoUsuarioForm) {
        nuevoUsuarioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('El usuario se ha creado con éxito');
            nuevoUsuarioForm.reset();
            screenNuevoUsuario.classList.remove('active');
            screenLogin.classList.add('active');
        });
    }

    if (consultarLegajoForm) {
        consultarLegajoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (resultadoLegajo) {
                resultadoLegajo.style.display = 'block';
            }
        });
    }


    // --- 1. Cargar años de 1998 a 2026 en C.M.A.O. ---
    const selectAnio = document.getElementById('input-anio');
    if (selectAnio) {
        selectAnio.innerHTML = '';
        for (let anio = 2026; anio >= 1998; anio--) {
            const option = document.createElement('option');
            option.value = anio;
            option.textContent = anio;
            selectAnio.appendChild(option);
        }
    }


    // --- 2. Navegación y Lógica de Boleta C.M.A.O. ---
    const btnCmao = document.getElementById('btn-cmao');
    const btnBack = document.getElementById('btn-back');
    const formCmao = document.getElementById('cmao-form');
    const inputImporte = document.getElementById('input-importe');
    const inputInteres = document.getElementById('input-interes');
    const inputValorFinal = document.getElementById('input-valor-final');
    const selectFormato = document.getElementById('input-formato');

    const calcularTotal = () => {
        const importe = parseFloat(inputImporte.value) || 0;
        const interes = parseFloat(inputInteres.value) || 0;
        const total = importe + interes;
        inputValorFinal.value = total > 0 ? total.toFixed(2) : '';
    };

    const generarInteresAleatorio = () => {
        if (inputInteres) {
            const interesRandom = Math.floor(Math.random() * (200000 - 100 + 1)) + 100;
            inputInteres.value = interesRandom;
            calcularTotal();
        }
    };

    const abrirPantallaCmao = (pantallaDesde, anioSeleccionado = '2026') => {
        pantallaOrigenCmao = pantallaDesde;
        if (btnBack) {
            btnBack.textContent = (pantallaDesde === screenHome) ? 'INICIO' : 'Volver';
        }
        if (selectAnio && anioSeleccionado) {
            selectAnio.value = anioSeleccionado;
        }
        if (inputImporte) {
            inputImporte.value = '';
        }
        generarInteresAleatorio();

        pantallaDesde.classList.remove('active');
        screenCmao.classList.add('active');
    };

    if (btnCmao) {
        btnCmao.addEventListener('click', () => {
            abrirPantallaCmao(screenHome, '2026');
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            screenCmao.classList.remove('active');
            pantallaOrigenCmao.classList.add('active');
        });
    }

    if (inputImporte) {
        inputImporte.addEventListener('input', calcularTotal);
    }

    if (selectAnio) {
        selectAnio.addEventListener('change', generarInteresAleatorio);
    }

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(valor);
    };

    if (formCmao) {
        formCmao.addEventListener('submit', async (e) => {
            e.preventDefault();

            const anio = selectAnio.value;
            const importe = parseFloat(inputImporte.value) || 0;
            const interes = parseFloat(inputInteres.value) || 0;
            const valorFinal = parseFloat(inputValorFinal.value) || 0;
            const formato = selectFormato.value;

            document.getElementById('boleta-fecha').textContent = new Date().toLocaleDateString('es-AR');
            document.getElementById('boleta-nro').textContent = `0004-${Math.floor(10000000 + Math.random() * 90000000)}`;
            document.getElementById('boleta-anio').textContent = anio;
            document.getElementById('boleta-importe').textContent = formatearMoneda(importe);
            document.getElementById('boleta-interes').textContent = formatearMoneda(interes);
            document.getElementById('boleta-total').textContent = formatearMoneda(valorFinal);
            document.getElementById('boleta-codigo-barras').textContent = `2026${anio}${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;

            const boletaElement = document.getElementById('boleta-template');
            const canvas = await html2canvas(boletaElement, { scale: 2, backgroundColor: '#ffffff' });
            const nombreArchivo = `Boleta_CMAO_${anio}`;

            if (formato === 'png') {
                const link = document.createElement('a');
                link.download = `${nombreArchivo}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } else {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgData = canvas.toDataURL('image/png');
                const pdfWidth = 190;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 10, 15, pdfWidth, pdfHeight);
                pdf.save(`${nombreArchivo}.pdf`);
            }
        });
    }


    // --- 3. Navegación Turnos Online y Generación de Comprobante ---
    const btnTurnos = document.getElementById('btn-turnos');
    const btnBackTurno = document.getElementById('btn-back-turno');
    const turnoForm = document.getElementById('turno-form');
    const btnVolverInicioTurno = document.getElementById('btn-volver-inicio-turno');
    const btnDescargarTurno = document.getElementById('btn-descargar-turno');

    if (btnTurnos) {
        btnTurnos.addEventListener('click', () => {
            screenHome.classList.remove('active');
            screenTurno.classList.add('active');
        });
    }

    if (btnBackTurno) {
        btnBackTurno.addEventListener('click', () => {
            screenTurno.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    if (turnoForm) {
        turnoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selectTipo = document.getElementById('tipo-atencion');
            const selectFecha = document.getElementById('seleccione-fecha');
            const selectHora = document.getElementById('horarios-disponibles');

            const tema = selectTipo.options[selectTipo.selectedIndex].text;
            const fechaTexto = selectFecha.options[selectFecha.selectedIndex].text;
            const hora = selectHora.value;

            document.getElementById('comp-dia-hora').textContent = `${fechaTexto} - ${hora} hs`;
            document.getElementById('comp-tema').textContent = tema;

            screenTurno.classList.remove('active');
            screenComprobanteTurno.classList.add('active');
        });
    }

    if (btnVolverInicioTurno) {
        btnVolverInicioTurno.addEventListener('click', () => {
            screenComprobanteTurno.classList.remove('active');
            screenTurno.classList.add('active');
        });
    }

    if (btnDescargarTurno) {
        btnDescargarTurno.addEventListener('click', async () => {
            const comprobanteElement = document.getElementById('comprobante-turno-print');
            const canvas = await html2canvas(comprobanteElement, { scale: 2, backgroundColor: '#f7cba1' });
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 140;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 35, 20, pdfWidth, pdfHeight);
            pdf.save('Comprobante_Turno_CAAITBA.pdf');
        });
    }


    // --- 4. Navegación y Funcionalidad de Consultas Online ---
    const btnConsultas = document.getElementById('btn-consultas');
    const btnBackConsultas = document.getElementById('btn-back-consultas');
    const consultaForm = document.getElementById('consulta-form');
    const selectConsultaTema = document.getElementById('consulta-tema');
    const inputConsultaTexto = document.getElementById('consulta-texto');
    const inputFile = document.getElementById('consulta-file');
    const archivoNombre = document.getElementById('archivo-nombre');
    const tablaConsultasBody = document.getElementById('tabla-consultas-body');

    if (btnConsultas) {
        btnConsultas.addEventListener('click', () => {
            pantallaOrigenConsultas = screenHome;
            if (btnBackConsultas) {
                btnBackConsultas.textContent = 'INICIO';
            }
            if (consultaForm) consultaForm.reset();
            if (archivoNombre) archivoNombre.textContent = '';
            screenHome.classList.remove('active');
            screenConsultas.classList.add('active');
        });
    }

    if (btnBackConsultas) {
        btnBackConsultas.addEventListener('click', () => {
            screenConsultas.classList.remove('active');
            pantallaOrigenConsultas.classList.add('active');
        });
    }

    if (inputFile) {
        inputFile.addEventListener('change', () => {
            archivoNombre.textContent = inputFile.files.length > 0 ? inputFile.files[0].name : '';
        });
    }

    if (consultaForm) {
        consultaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const tema = selectConsultaTema.options[selectConsultaTema.selectedIndex].text;
            const texto = inputConsultaTexto.value;

            const ahora = new Date();
            const dia = String(ahora.getDate()).padStart(2, '0');
            const mes = String(ahora.getMonth() + 1).padStart(2, '0');
            const anio = ahora.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td class="col-comentario"><strong>[${tema}]</strong> ${texto}</td>
                <td class="col-fecha">${fechaFormateada}</td>
            `;

            tablaConsultasBody.prepend(nuevaFila);

            while (tablaConsultasBody.rows.length > 4) {
                tablaConsultasBody.deleteRow(tablaConsultasBody.rows.length - 1);
            }

            alert('Su consulta fue enviada correctamente.');
            consultaForm.reset();
            if (archivoNombre) {
                archivoNombre.textContent = '';
            }
        });
    }


    // --- 5. Navegación y Funcionalidad de Situación del Afiliado, Contratos y Formularios ---
    const btnDeuda = document.getElementById('btn-deuda');
    const btnBackDeuda = document.getElementById('btn-back-deuda');
    const linkGenerar2024 = document.getElementById('link-generar-2024');
    const linkSolicitarLiquidacion = document.getElementById('link-solicitar-liquidacion');
    const linkGenerar2026 = document.getElementById('link-generar-2026');

    const linkVerContratos = document.getElementById('link-ver-contratos');
    const linkVerFormularios = document.getElementById('link-ver-formularios');
    const btnBackContratos = document.getElementById('btn-back-contratos');
    const btnBackFormularios = document.getElementById('btn-back-formularios');

    if (btnDeuda && screenDeuda) {
        btnDeuda.addEventListener('click', () => {
            screenHome.classList.remove('active');
            screenDeuda.classList.add('active');
        });
    }

    if (btnBackDeuda && screenDeuda) {
        btnBackDeuda.addEventListener('click', () => {
            screenDeuda.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    if (linkGenerar2024 && screenDeuda) {
        linkGenerar2024.addEventListener('click', (e) => {
            e.preventDefault();
            abrirPantallaCmao(screenDeuda, '2024');
        });
    }

    if (linkSolicitarLiquidacion && screenDeuda && screenConsultas) {
        linkSolicitarLiquidacion.addEventListener('click', (e) => {
            e.preventDefault();
            pantallaOrigenConsultas = screenDeuda;
            if (btnBackConsultas) {
                btnBackConsultas.textContent = 'Volver';
            }

            screenDeuda.classList.remove('active');
            screenConsultas.classList.add('active');

            if (selectConsultaTema) {
                selectConsultaTema.value = 'C.M.A.O. / Eximiciones';
            }

            if (inputConsultaTexto) {
                inputConsultaTexto.value = 'Solicito reliquidación del expediente n° 111111 (CMAO 2024)....';
                inputConsultaTexto.focus();
            }
        });
    }

    if (linkGenerar2026 && screenDeuda) {
        linkGenerar2026.addEventListener('click', (e) => {
            e.preventDefault();
            abrirPantallaCmao(screenDeuda, '2026');
        });
    }

    if (linkVerContratos && screenContratos) {
        linkVerContratos.addEventListener('click', (e) => {
            e.preventDefault();
            screenDeuda.classList.remove('active');
            screenContratos.classList.add('active');
        });
    }

    if (btnBackContratos && screenContratos) {
        btnBackContratos.addEventListener('click', () => {
            screenContratos.classList.remove('active');
            screenDeuda.classList.add('active');
        });
    }

    if (linkVerFormularios && screenFormularios) {
        linkVerFormularios.addEventListener('click', (e) => {
            e.preventDefault();
            screenDeuda.classList.remove('active');
            screenFormularios.classList.add('active');
        });
    }

    if (btnBackFormularios && screenFormularios) {
        btnBackFormularios.addEventListener('click', () => {
            screenFormularios.classList.remove('active');
            screenDeuda.classList.add('active');
        });
    }

    document.querySelectorAll('.btn-ir-cmao').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pantallaActual = (screenContratos && screenContratos.classList.contains('active'))
                ? screenContratos
                : screenFormularios;
            abrirPantallaCmao(pantallaActual, '2026');
        });
    });
});