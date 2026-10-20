document.addEventListener('DOMContentLoaded', () => {
    const screenHome = document.getElementById('screen-home');
    const screenCmao = document.getElementById('screen-cmao');
    const btnCmao = document.getElementById('btn-cmao');
    const btnBack = document.getElementById('btn-back');

    const formCmao = document.getElementById('cmao-form');
    const selectAnio = document.getElementById('input-anio');
    const inputImporte = document.getElementById('input-importe');
    const inputInteres = document.getElementById('input-interes');
    const inputValorFinal = document.getElementById('input-valor-final');
    const selectFormato = document.getElementById('input-formato');

    // 1. Cargar años de 1998 a 2026
    if (selectAnio) {
        selectAnio.innerHTML = '';
        for (let anio = 2026; anio >= 1998; anio--) {
            const option = document.createElement('option');
            option.value = anio;
            option.textContent = anio;
            selectAnio.appendChild(option);
        }
    }

    // 2. Al presionar "C.M.A.O.", oculta el menú de 4 botones y muestra Liquidación C.M.A.O.
    btnCmao.addEventListener('click', () => {
        screenHome.classList.remove('active');
        screenCmao.classList.add('active');
    });

    // Al presionar "← Volver al menú", vuelve a los 4 botones
    btnBack.addEventListener('click', () => {
        screenCmao.classList.remove('active');
        screenHome.classList.add('active');
    });

    // Referencias para Turnos Online
    const screenTurno = document.getElementById('screen-turno');
    const btnTurnos = document.getElementById('btn-turnos');
    const btnBackTurno = document.getElementById('btn-back-turno');
    const turnoForm = document.getElementById('turno-form');

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
            alert('¡Turno solicitado con éxito!');
            turnoForm.reset();
            screenTurno.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

    // Aviso en los otros 3 botones
    document.querySelectorAll('.btn-caaitba[data-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            const seccion = btn.getAttribute('data-section');
            alert(`Sección "${seccion}" próximamente disponible.`);
        });
    });

    // 3. Suma automática de Importe + Interés = Valor Final
    const calcularTotal = () => {
        const importe = parseFloat(inputImporte.value) || 0;
        const interes = parseFloat(inputInteres.value) || 0;
        const total = importe + interes;
        inputValorFinal.value = total > 0 ? total.toFixed(2) : '';
    };

    inputImporte.addEventListener('input', calcularTotal);
    inputInteres.addEventListener('input', calcularTotal);

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(valor);
    };

    // 4. Generar Boleta en PDF o PNG
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
});

// Referencias para Turnos Online
    const screenTurno = document.getElementById('screen-turno');
    const btnTurnosOnline = document.querySelector('.btn-caaitba[data-section="Turnos Online"]');
    const btnBackTurno = document.getElementById('btn-back-turno');
    const turnoForm = document.getElementById('turno-form');

    if (btnTurnosOnline) {
        btnTurnosOnline.addEventListener('click', () => {
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
            alert('¡Turno solicitado con éxito!');
            turnoForm.reset();
            screenTurno.classList.remove('active');
            screenHome.classList.add('active');
        });
    }