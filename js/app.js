document.addEventListener('DOMContentLoaded', () => {
    // Referencias de todas las pantallas
    const screenLogin = document.getElementById('screen-login');
    const screenHome = document.getElementById('screen-home');
    const screenCmao = document.getElementById('screen-cmao');
    const screenTurno = document.getElementById('screen-turno');
    const screenComprobanteTurno = document.getElementById('screen-comprobante-turno');
    const screenConsultas = document.getElementById('screen-consultas');
    const screenDeuda = document.getElementById('screen-deuda');
    const screenContratos = document.getElementById('screen-contratos');
    const screenFormularios = document.getElementById('screen-formularios');

    // 0. Lógica de Inicio de Sesión (Login)
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            screenLogin.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    document.querySelectorAll('.login-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const opcion = link.getAttribute('data-link');
            alert(`Opción "${opcion}" próximamente disponible.`);
        });
    });

    // 1. Cargar años de 1998 a 2026 en C.M.A.O.
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

    // 2. Navegación y Lógica de Boleta C.M.A.O.
    const btnCmao = document.getElementById('btn-cmao');
    const btnBack = document.getElementById('btn-back');
    const formCmao = document.getElementById('cmao-form');
    const inputImporte = document.getElementById('input-importe');
    const inputInteres = document.getElementById('input-interes');
    const inputValorFinal = document.getElementById('input-valor-final');
    const selectFormato = document.getElementById('input-formato');

    if (btnCmao) {
        btnCmao.addEventListener('click', () => {
            screenHome.classList.remove('active');
            screenCmao.classList.add('active');
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            screenCmao.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    const calcularTotal = () => {
        const importe = parseFloat(inputImporte.value) || 0;
        const interes = parseFloat(inputInteres.value) || 0;
        const total = importe + interes;
        inputValorFinal.value = total > 0 ? total.toFixed(2) : '';
    };

    if (inputImporte && inputInteres) {
        inputImporte.addEventListener('input', calcularTotal);
        inputInteres.addEventListener('input', calcularTotal);
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

    // 3. Navegación Turnos Online y Generación de Comprobante
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
            turnoForm.reset();
            screenComprobanteTurno.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    if (btnDescargarTurno) {
        btnDescargarTurno.addEventListener('click', async () => {
            const comprobanteElement = document.getElementById('comprobante-turno-print');
            const canvas = await html2canvas(comprobanteElement, { scale: 2, backgroundColor: '#ffecb5' });
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 140;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 35, 20, pdfWidth, pdfHeight);
            pdf.save('Comprobante_Turno_CAAITBA.pdf');
        });
    }

    // 4. Navegación y Funcionalidad de Consultas Online
    const btnConsultas = document.getElementById('btn-consultas');
    const btnBackConsultas = document.getElementById('btn-back-consultas');
    const consultaForm = document.getElementById('consulta-form');
    const inputFile = document.getElementById('consulta-file');
    const archivoNombre = document.getElementById('archivo-nombre');
    const tablaConsultasBody = document.getElementById('tabla-consultas-body');
    const linkGuia = document.getElementById('link-guia-tramites');

    if (btnConsultas) {
        btnConsultas.addEventListener('click', () => {
            screenHome.classList.remove('active');
            screenConsultas.classList.add('active');
        });
    }

    if (btnBackConsultas) {
        btnBackConsultas.addEventListener('click', () => {
            screenConsultas.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    if (linkGuia) {
        linkGuia.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Guía de Trámites próximamente disponible.');
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

            const selectTema = document.getElementById('consulta-tema');
            const tema = selectTema.options[selectTema.selectedIndex].text;
            const texto = document.getElementById('consulta-texto').value;
            const adjunto = inputFile && inputFile.files.length > 0 ? inputFile.files[0].name : '';

            const nroRandom = Math.floor(2986000 + Math.random() * 9000);
            const ahora = new Date();
            const fechaFormateada = `${ahora.toLocaleDateString('es-AR')} ${ahora.toLocaleTimeString('es-AR', { hour12: false })}`;

            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${nroRandom}</td>
                <td>Consulta On Line</td>
                <td><strong>[${tema}]</strong> ${texto}</td>
                <td>${adjunto}</td>
                <td>${fechaFormateada}</td>
            `;

            tablaConsultasBody.prepend(nuevaFila);
            alert('Su consulta fue enviada correctamente.');
            consultaForm.reset();
            archivoNombre.textContent = '';
        });
    }

    // 5. Navegación y Funcionalidad de Situación del Afiliado, Contratos y Formularios
    const btnDeuda = document.getElementById('btn-deuda');
    const btnBackDeuda = document.getElementById('btn-back-deuda');
    const linkSaldarDeuda = document.getElementById('link-saldar-deuda');

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

    if (linkSaldarDeuda && screenDeuda) {
        linkSaldarDeuda.addEventListener('click', (e) => {
            e.preventDefault();
            screenDeuda.classList.remove('active');
            screenCmao.classList.add('active');
            if (selectAnio) {
                selectAnio.value = '2021';
            }
        });
    }

    // Abrir Consulta Contratos
    if (linkVerContratos && screenContratos) {
        linkVerContratos.addEventListener('click', (e) => {
            e.preventDefault();
            screenDeuda.classList.remove('active');
            screenContratos.classList.add('active');
        });
    }

    // Volver de Contratos a Situación
    if (btnBackContratos && screenContratos) {
        btnBackContratos.addEventListener('click', () => {
            screenContratos.classList.remove('active');
            screenDeuda.classList.add('active');
        });
    }

    // Abrir Consulta de Formularios (FO)
    if (linkVerFormularios && screenFormularios) {
        linkVerFormularios.addEventListener('click', (e) => {
            e.preventDefault();
            screenDeuda.classList.remove('active');
            screenFormularios.classList.add('active');
        });
    }

    // Volver de Formularios a Situación
    if (btnBackFormularios && screenFormularios) {
        btnBackFormularios.addEventListener('click', () => {
            screenFormularios.classList.remove('active');
            screenDeuda.classList.add('active');
        });
    }

    // Enlaces "Quiero Saldar Deuda" / "Generar Boleta de Aportes" hacia Boleta C.M.A.O.
    document.querySelectorAll('.btn-ir-cmao').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (screenContratos) screenContratos.classList.remove('active');
            if (screenFormularios) screenFormularios.classList.remove('active');
            screenCmao.classList.add('active');
        });
    });
});