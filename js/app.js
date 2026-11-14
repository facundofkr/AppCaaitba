const iniciarAppCaaitba = () => {
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

    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalBtnAccept = document.getElementById('modal-btn-accept');
    let modalCallback = null;

    const cerrarModal = () => {
        if (customModal) {
            customModal.classList.remove('active');
        }
        if (typeof modalCallback === 'function') {
            const accion = modalCallback;
            modalCallback = null;
            accion();
        }
    };

    const mostrarModal = (mensaje, callback = null, titulo = 'Aviso CAAITBA') => {
        if (modalMessage && customModal) {
            if (modalTitle) {
                modalTitle.textContent = titulo;
            }
            modalMessage.textContent = mensaje;
            modalCallback = callback;
            customModal.classList.add('active');
        }
    };

    if (modalBtnAccept) {
        modalBtnAccept.addEventListener('click', cerrarModal);
    }

    if (customModal) {
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) {
                cerrarModal();
            }
        });
    }

    mostrarModal(
        'Puede ingresar cualquier tipo de dato, no tiene impacto real',
        null,
        'VERSIÓN DE PRUEBA'
    );

    const crearQrSvg = (semillaTexto, dimension = 105) => {
        const size = 25;
        const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

        const agregarPatron = (r0, c0) => {
            for (let r = 0; r < 7; r++) {
                for (let c = 0; c < 7; c++) {
                    if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                        matrix[r0 + r][c0 + c] = true;
                    }
                }
            }
        };

        agregarPatron(0, 0);
        agregarPatron(0, size - 7);
        agregarPatron(size - 7, 0);

        let hash = 2166136261;
        for (let i = 0; i < semillaTexto.length; i++) {
            hash ^= semillaTexto.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const enEsquina = (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8);
                if (enEsquina) continue;
                if (r === 6 || c === 6) {
                    matrix[r][c] = (r + c) % 2 === 0;
                } else {
                    hash ^= (r * 31 + c * 17);
                    hash = Math.imul(hash, 16777619);
                    matrix[r][c] = (Math.abs(hash) % 10) < 5;
                }
            }
        }

        let rects = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c]) {
                    rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#1e1e1e"/>`;
                }
            }
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${dimension}" height="${dimension}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/>${rects}</svg>`;
    };

    const crearBarcodeSvg = (codigoNumerico) => {
        const patrones = [2, 1, 1, 2, 3, 1];
        for (let i = 0; i < codigoNumerico.length; i++) {
            const digito = parseInt(codigoNumerico[i], 10) || 0;
            patrones.push(
                (digito % 3) + 1,
                ((digito + 1) % 2) + 1,
                ((digito * 2) % 3) + 1,
                digito < 5 ? 1 : 2,
                ((digito + 2) % 3) + 1,
                1
            );
        }
        patrones.push(2, 3, 1, 1, 2);

        let x = 0;
        let rects = '';
        for (let i = 0; i < patrones.length; i++) {
            const ancho = patrones[i];
            if (i % 2 === 0) {
                rects += `<rect x="${x}" y="0" width="${ancho}" height="48" fill="#111111"/>`;
            }
            x += ancho;
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 48" width="100%" height="48" preserveAspectRatio="none" shape-rendering="crispEdges"><rect width="${x}" height="48" fill="#ffffff"/>${rects}</svg>`;
    };

    const exportarPlantillaUnificada = async (config) => {
        document.getElementById('boleta-badge').textContent = config.badge;
        document.getElementById('boleta-nro').textContent = config.nroComprobante;
        document.getElementById('boleta-solicitud').textContent = config.nroSolicitud;
        document.getElementById('boleta-fecha').textContent = config.fechaEmision;
        document.getElementById('boleta-afiliado').textContent = config.afiliado;
        document.getElementById('boleta-vencimiento-label').textContent = config.vencimientoLabel;
        document.getElementById('boleta-vencimiento').textContent = config.vencimientoValor;
        document.getElementById('boleta-concepto-titulo').textContent = config.tituloSeccion;
        document.getElementById('boleta-col1-header').textContent = config.col1Header;
        document.getElementById('boleta-col2-header').textContent = config.col2Header;

        const tbody = document.getElementById('boleta-tabla-body');
        tbody.innerHTML = '';
        config.filas.forEach((fila) => {
            const tr = document.createElement('tr');
            if (fila.esTotal) {
                tr.classList.add('row-total');
            }
            tr.innerHTML = `
                <td>${fila.concepto}</td>
                <td class="col-right">${fila.valor}</td>
            `;
            tbody.appendChild(tr);
        });

        const declaracionEl = document.getElementById('boleta-declaracion');
        declaracionEl.innerHTML = config.declaracionHtml;

        const mediosEl = document.getElementById('boleta-medios-pago');
        mediosEl.style.display = config.mostrarMediosPago ? 'block' : 'none';

        document.getElementById('boleta-qr-caption').textContent = config.qrCaption;
        document.getElementById('boleta-barcode-label').textContent = config.barcodeLabel;
        document.getElementById('boleta-codigo-barras').textContent = config.codigoBarras;
        document.getElementById('boleta-qr-box').innerHTML = crearQrSvg(config.codigoBarras, 105);
        document.getElementById('boleta-barcode-svg').innerHTML = crearBarcodeSvg(config.codigoBarras);

        const boletaElement = document.getElementById('boleta-template');
        const canvas = await html2canvas(boletaElement, { scale: 2, backgroundColor: '#ffffff' });

        if (config.formato === 'png') {
            const link = document.createElement('a');
            link.download = `${config.nombreArchivo}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 190;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 12, pdfWidth, pdfHeight);
            pdf.save(`${config.nombreArchivo}.pdf`);
        }
    };

    let pantallaOrigenCmao = screenHome;
    let pantallaOrigenConsultas = screenHome;

    const loginForm = document.getElementById('login-form');
    const recuperarForm = document.getElementById('recuperar-form');
    const nuevoUsuarioForm = document.getElementById('nuevo-usuario-form');
    const consultarLegajoForm = document.getElementById('consultar-legajo-form');
    const resultadoLegajo = document.getElementById('resultado-legajo');

    const linkRecuperar = document.getElementById('link-recuperar');
    const linkNuevoUsuario = document.getElementById('link-nuevo-usuario');
    const linkConsultarLegajo = document.getElementById('link-consultar-legajo');
    
    const btnBackRecuperar = document.getElementById('btn-back-recuperar');
    const btnBackNuevoUsuario = document.getElementById('btn-back-nuevo-usuario');
    const btnBackConsultarLegajo = document.getElementById('btn-back-consultar-legajo');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            screenLogin.classList.remove('active');
            screenHome.classList.add('active');
        });
    }

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
            if (resultadoLegajo) resultadoLegajo.classList.remove('visible');
            if (consultarLegajoForm) consultarLegajoForm.reset();
            screenLogin.classList.remove('active');
            screenConsultarLegajo.classList.add('active');
        });
    }

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

    if (recuperarForm) {
        recuperarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarModal('Se envió la contraseña al mail indicado', () => {
                recuperarForm.reset();
                screenRecuperar.classList.remove('active');
                screenLogin.classList.add('active');
            });
        });
    }

    if (nuevoUsuarioForm) {
        nuevoUsuarioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarModal('El usuario se ha creado con éxito', () => {
                nuevoUsuarioForm.reset();
                screenNuevoUsuario.classList.remove('active');
                screenLogin.classList.add('active');
            });
        });
    }

    if (consultarLegajoForm) {
        consultarLegajoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (resultadoLegajo) {
                resultadoLegajo.classList.add('visible');
            }
        });
    }

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

    const abrirPantallaCmao = (pantallaDesde, anioSeleccionado = '2026', importePredefinido = '') => {
        pantallaOrigenCmao = pantallaDesde;
        if (btnBack) {
            btnBack.textContent = (pantallaDesde === screenHome) ? 'INICIO' : 'Volver';
        }
        if (selectAnio && anioSeleccionado) {
            selectAnio.value = anioSeleccionado;
        }
        if (inputImporte) {
            inputImporte.value = importePredefinido;
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

            const hoy = new Date();
            const vto = new Date(hoy);
            vto.setDate(hoy.getDate() + 15);

            const fechaEmision = hoy.toLocaleDateString('es-AR');
            const fechaVencimiento = vto.toLocaleDateString('es-AR');
            const nroBoleta = String(Math.floor(1000000 + Math.random() * 9000000));
            const nroSolicitud = String(Math.floor(100000 + Math.random() * 900000));
            const codigoBarras = `031201181980${nroSolicitud}${nroBoleta}0000000012${anio}${Math.floor(10000000 + Math.random() * 89999999)}`;

            await exportarPlantillaUnificada({
                badge: 'BOLETA DIGITAL DE PAGO',
                nroComprobante: nroBoleta,
                nroSolicitud: nroSolicitud,
                fechaEmision: fechaEmision,
                afiliado: 'Legajo 118198/0 — REVOLERO TATIANA',
                vencimientoLabel: 'VENCIMIENTO',
                vencimientoValor: fechaVencimiento,
                tituloSeccion: `TRÁMITE: CUOTA MÍNIMA ANUAL OBLIGATORIA (C.M.A.O.) — PERÍODO ${anio}`,
                col1Header: 'DETALLE DE CONCEPTOS IMPUTADOS',
                col2Header: 'IMPORTE',
                filas: [
                    { concepto: `Cuota Mínima Anual Obligatoria (C.M.A.O.) — Año ${anio}`, valor: formatearMoneda(importe) },
                    { concepto: 'Intereses / Recargos Administrativos CAAITBA (Ley 12.490)', valor: formatearMoneda(interes) },
                    { concepto: 'TOTAL A ABONAR', valor: formatearMoneda(valorFinal), esTotal: true }
                ],
                declaracionHtml: `<strong>Información Previsional (Ley 12.490):</strong> Boleta generada por autogestión para imputación de aportes del período ${anio}. El trámite queda acreditado una vez confirmado el pago ante CAAITBA hasta la fecha de vencimiento indicada.`,
                mostrarMediosPago: true,
                qrCaption: 'ESCANEÁ PARA PAGAR CON QR',
                barcodeLabel: 'CÓDIGO DE BARRAS PARA PAGO EN VENTANILLA / CAJERO',
                codigoBarras: codigoBarras,
                formato: formato,
                nombreArchivo: `Boleta_CMAO_${anio}`
            });
        });
    }

    const btnTurnos = document.getElementById('btn-turnos');
    const btnBackTurno = document.getElementById('btn-back-turno');
    const turnoForm = document.getElementById('turno-form');
    const btnVolverInicioTurno = document.getElementById('btn-volver-inicio-turno');
    const btnDescargarTurno = document.getElementById('btn-descargar-turno');

    let ultimoTurnoGenerado = {
        tema: '-',
        fechaTexto: '-',
        hora: '-',
        tercero: 'Sin tercero autorizado',
        motivo: '-',
        nroTurno: '-',
        nroSolicitud: '-',
        codigoBarras: '03120118198000000000000000000000000000000000'
    };

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
            const inputTercero = document.getElementById('tercero-autorizado');
            const inputMotivo = document.getElementById('motivo-turno');

            const tema = selectTipo.options[selectTipo.selectedIndex].text;
            const fechaTexto = selectFecha.options[selectFecha.selectedIndex].text;
            const hora = selectHora.value;
            const tercero = inputTercero && inputTercero.value.trim() !== ''
                ? inputTercero.value.trim()
                : 'Titular (Sin tercero)';
            const motivo = inputMotivo && inputMotivo.value.trim() !== ''
                ? inputMotivo.value.trim()
                : 'Consulta presencial en delegación';

            const nroTurno = `T-${Math.floor(100000 + Math.random() * 900000)}`;
            const nroSolicitud = String(Math.floor(100000 + Math.random() * 900000));
            const codigoBarras = `031201181980${nroSolicitud}20261021${Math.floor(100000000000 + Math.random() * 899999999999)}`;

            ultimoTurnoGenerado = {
                tema,
                fechaTexto,
                hora,
                tercero,
                motivo,
                nroTurno,
                nroSolicitud,
                codigoBarras
            };

            document.getElementById('comp-dia-hora').textContent = `${fechaTexto} - ${hora} hs`;
            document.getElementById('comp-tema').textContent = tema;
            const compTercero = document.getElementById('comp-tercero');
            if (compTercero) {
                compTercero.textContent = tercero;
            }
            const compQrMini = document.getElementById('comp-qr-mini');
            if (compQrMini) {
                compQrMini.innerHTML = crearQrSvg(codigoBarras, 68);
            }

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
            const fechaEmision = new Date().toLocaleDateString('es-AR');

            await exportarPlantillaUnificada({
                badge: 'COMPROBANTE OFICIAL DE TURNO',
                nroComprobante: ultimoTurnoGenerado.nroTurno,
                nroSolicitud: ultimoTurnoGenerado.nroSolicitud,
                fechaEmision: fechaEmision,
                afiliado: 'Legajo 118198/0 — REVOLERO TATIANA',
                vencimientoLabel: 'FECHA Y HORA ASIGNADA',
                vencimientoValor: `${ultimoTurnoGenerado.fechaTexto} (${ultimoTurnoGenerado.hora} hs)`,
                col1Header: 'DATOS DEL TURNO SOLICITADO',
                col2Header: 'DETALLE REGISTRADO',
                filas: [
                    { concepto: 'Sector / Tipo de Atención', valor: ultimoTurnoGenerado.tema },
                    { concepto: 'Persona Autorizada a Asistir', valor: ultimoTurnoGenerado.tercero },
                    { concepto: 'Motivo Declarado', valor: ultimoTurnoGenerado.motivo },
                    { concepto: 'Dirección', valor: 'Calle 48 N° 695, La Plata', esTotal: true }
                ],
                declaracionHtml: '<strong>Requisitos de Asistencia:</strong> En caso de asistir un tercero autorizado, deberá exhibir su DNI y la documentación respaldatoria del trámite.',
                mostrarMediosPago: false,
                qrCaption: 'QR DE ACREDITACIÓN EN RECEPCIÓN',
                barcodeLabel: 'CÓDIGO DE VALIDACIÓN DE TURNO EN TERMINAL DE AUTOGESTIÓN',
                codigoBarras: ultimoTurnoGenerado.codigoBarras,
                formato: 'pdf',
                nombreArchivo: `Comprobante_Turno_${ultimoTurnoGenerado.nroTurno}`
            });
        });
    }

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
                <td class="col-fecha"><span class="fecha-pill">${fechaFormateada}</span></td>
            `;

            tablaConsultasBody.prepend(nuevaFila);

            while (tablaConsultasBody.rows.length > 4) {
                tablaConsultasBody.deleteRow(tablaConsultasBody.rows.length - 1);
            }

            mostrarModal('Su consulta fue enviada correctamente.', () => {
                consultaForm.reset();
                if (archivoNombre) {
                    archivoNombre.textContent = '';
                }
            });
        });
    }

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

    document.querySelectorAll('.tabla-situacion td.col-valor').forEach((celda) => {
        celda.addEventListener('click', (e) => {
            const enlaceInterno = celda.querySelector('a');
            if (enlaceInterno && e.target !== enlaceInterno && !enlaceInterno.contains(e.target)) {
                enlaceInterno.click();
            }
        });
    });

    document.querySelectorAll('.btn-ir-cmao').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pantallaActual = (screenContratos && screenContratos.classList.contains('active'))
                ? screenContratos
                : screenFormularios;
            const anioFila = link.getAttribute('data-anio') || '2026';
            const importeFila = link.getAttribute('data-importe') || '';
            abrirPantallaCmao(pantallaActual, anioFila, importeFila);
        });
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarAppCaaitba);
} else {
    iniciarAppCaaitba();
}