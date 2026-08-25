-- Actualiza la función guardar_entrevista para recibir metadata de cambios y registrar la acción correcta si es una corrección.
DROP FUNCTION IF EXISTS public.guardar_entrevista(integer, uuid, jsonb, jsonb, jsonb, jsonb);

CREATE OR REPLACE FUNCTION public.guardar_entrevista(
    p_id_caso integer,
    p_usuario_id uuid,
    p_caso jsonb,
    p_usuario jsonb,
    p_demandado jsonb DEFAULT NULL,
    p_contrato jsonb DEFAULT NULL,
    p_cambios jsonb DEFAULT NULL,
    p_es_correccion boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_id_usuario uuid;
BEGIN
    -- Obtener id_usuario del caso (cliente real, para usuarios/contrato)
    SELECT id_usuario INTO v_id_usuario FROM public.casos WHERE id_caso = p_id_caso;

    -- Asegurar que el estudiante autenticado exista en perfiles para la FK de auditoria_casos
    IF NOT EXISTS (SELECT 1 FROM public.perfiles WHERE id = p_usuario_id) THEN
        INSERT INTO public.perfiles (id, activo) VALUES (p_usuario_id, true);
    END IF;

    -- 1. Actualizar caso
    UPDATE public.casos SET
        area = (NULLIF(p_caso->>'area', ''))::public.area_enum,
        resumen_hechos = NULLIF(p_caso->>'resumen_hechos', ''),
        observaciones_estudiante = NULLIF(p_caso->>'observaciones_estudiante', ''),
        estado = 'pendiente_aprobacion',
        fecha_vencimiento_asesor = public.sumar_dias_habiles(now(), 2),
        fecha_entrega_entrevista = now(),
        fecha_vencimiento_estudiante = NULL
    WHERE id_caso = p_id_caso;

    -- 2. Actualizar usuarios (cliente, v_id_usuario) con todo el formulario sociodemografico
    UPDATE public.usuarios SET
        correo = NULLIF(p_usuario->>'correo', ''),
        edad = NULLIF(p_usuario->>'edad', '')::int,
        contacto_familiar = NULLIF(p_usuario->>'contacto_familiar', ''),
        estado_civil = (NULLIF(p_usuario->>'estado_civil', ''))::public.estado_civil_enum,
        estrato = NULLIF(p_usuario->>'estrato', '')::int,
        direccion = NULLIF(p_usuario->>'direccion', ''),
        tipo_vivienda = NULLIF(p_usuario->>'tipo_vivienda', ''),
        tiene_representado = NULLIF(p_usuario->>'tiene_representado', '')::boolean,
        situacion_laboral = (NULLIF(p_usuario->>'situacion_laboral', ''))::public.situacion_laboral_enum,
        otros_ingresos = NULLIF(p_usuario->>'otros_ingresos', '')::boolean,
        valor_otros_ingresos = NULLIF(p_usuario->>'valor_otros_ingresos', '')::numeric,
        concepto_otros_ingresos = NULLIF(p_usuario->>'concepto_otros_ingresos', ''),
        tiene_contrato = NULLIF(p_usuario->>'tiene_contrato', '')::boolean,
        tipo_documento = NULLIF(p_usuario->>'tipo_documento', ''),
        fecha_expedicion_doc = NULLIF(p_usuario->>'fecha_expedicion_doc', '')::date,
        ciudad_expedicion = NULLIF(p_usuario->>'ciudad_expedicion', ''),
        fecha_nacimiento = NULLIF(p_usuario->>'fecha_nacimiento', '')::date,
        nacionalidad = NULLIF(p_usuario->>'nacionalidad', ''),
        identidad_genero = NULLIF(p_usuario->>'identidad_genero', ''),
        orientacion_sexual = NULLIF(p_usuario->>'orientacion_sexual', ''),
        escolaridad = NULLIF(p_usuario->>'escolaridad', ''),
        grupo_etnico = NULLIF(p_usuario->>'grupo_etnico', ''),
        barrio = NULLIF(p_usuario->>'barrio', ''),
        zona = NULLIF(p_usuario->>'zona', ''),
        tenencia_vivienda = NULLIF(p_usuario->>'tenencia_vivienda', ''),
        comuna = NULLIF(p_usuario->>'comuna', ''),
        tiene_sisben = NULLIF(p_usuario->>'tiene_sisben', '')::boolean,
        personas_cargo = NULLIF(p_usuario->>'personas_cargo', '')::int,
        rango_salarial = NULLIF(p_usuario->>'rango_salarial', ''),
        servicios_publicos = NULLIF(p_usuario->>'servicios_publicos', ''),
        sabe_leer = NULLIF(p_usuario->>'sabe_leer', '')::boolean,
        discapacidad = NULLIF(p_usuario->>'discapacidad', ''),
        condicion_actual = NULLIF(p_usuario->>'condicion_actual', ''),
        enfoque_diverso = NULLIF(p_usuario->>'enfoque_diverso', '')::boolean,
        caracterizacion_lgbtiq = (NULLIF(p_usuario->>'caracterizacion_lgbtiq', ''))::public.caracterizacion_lgbtiq_enum
    WHERE id_usuario = v_id_usuario;

    -- 3. Insertar / actualizar demandado
    IF p_demandado IS NOT NULL AND NULLIF(p_demandado->>'nombre_completo', '') IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.demandados WHERE id_caso = p_id_caso) THEN
            UPDATE public.demandados SET
                nombre_completo = p_demandado->>'nombre_completo',
                documento = NULLIF(p_demandado->>'documento', ''),
                celular = NULLIF(p_demandado->>'celular', ''),
                lugar_residencia = NULLIF(p_demandado->>'lugar_residencia', ''),
                correo = NULLIF(p_demandado->>'correo', '')
            WHERE id_caso = p_id_caso;
        ELSE
            INSERT INTO public.demandados (
                id_caso, nombre_completo, documento, celular, lugar_residencia, correo
            ) VALUES (
                p_id_caso,
                p_demandado->>'nombre_completo',
                NULLIF(p_demandado->>'documento', ''),
                NULLIF(p_demandado->>'celular', ''),
                NULLIF(p_demandado->>'lugar_residencia', ''),
                NULLIF(p_demandado->>'correo', '')
            );
        END IF;
    END IF;

    -- 4. Insertar / actualizar contrato laboral (del cliente, v_id_usuario)
    IF p_contrato IS NOT NULL AND NULLIF(p_contrato->>'tipo_contrato', '') IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.contratos_laborales WHERE id_usuario = v_id_usuario) THEN
            UPDATE public.contratos_laborales SET
                tipo_contrato = (NULLIF(p_contrato->>'tipo_contrato', ''))::public.tipo_contrato_enum,
                representante_legal = NULLIF(p_contrato->>'representante_legal', ''),
                direccion_empresa = NULLIF(p_contrato->>'direccion_empresa', ''),
                correo_patrono = NULLIF(p_contrato->>'correo_patrono', ''),
                fecha_inicio = NULLIF(p_contrato->>'fecha_inicio', '')::date,
                fecha_fin = NULLIF(p_contrato->>'fecha_fin', '')::date,
                continua = COALESCE(NULLIF(p_contrato->>'continua', '')::boolean, false),
                salario_inicial = NULLIF(p_contrato->>'salario_inicial', '')::numeric,
                salario_actual = NULLIF(p_contrato->>'salario_actual', '')::numeric
            WHERE id_usuario = v_id_usuario;
        ELSE
            INSERT INTO public.contratos_laborales (
                id_usuario, tipo_contrato, representante_legal, direccion_empresa,
                correo_patrono, fecha_inicio, fecha_fin, continua,
                salario_inicial, salario_actual
            ) VALUES (
                v_id_usuario,
                (NULLIF(p_contrato->>'tipo_contrato', ''))::public.tipo_contrato_enum,
                NULLIF(p_contrato->>'representante_legal', ''),
                NULLIF(p_contrato->>'direccion_empresa', ''),
                NULLIF(p_contrato->>'correo_patrono', ''),
                NULLIF(p_contrato->>'fecha_inicio', '')::date,
                NULLIF(p_contrato->>'fecha_fin', '')::date,
                COALESCE(NULLIF(p_contrato->>'continua', '')::boolean, false),
                NULLIF(p_contrato->>'salario_inicial', '')::numeric,
                NULLIF(p_contrato->>'salario_actual', '')::numeric
            );
        END IF;
    END IF;

    -- 5. Auto-resolver llamados de atencion del estudiante
    UPDATE public.llamados_atencion
    SET resuelto = true,
        fecha_resolucion = now()
    WHERE id_caso = p_id_caso
      AND tipo = 'estudiante'
      AND resuelto = false;

    -- 6. Insert auditoria con id_usuario del estudiante (p_usuario_id, garantiza FK a perfiles)
    --
    -- La accion es SIEMPRE 'entrevista', tambien cuando es una correccion.
    -- trg_auditoria_notificar (20260405000000) descarta toda accion fuera de
    -- ('entrevista','aprobacion','correccion','observacion'), asi que un nombre
    -- propio como 'edicion_estudiante_correccion' dejaba al asesor sin aviso
    -- cuando el estudiante reenviaba el caso. Lo que distingue una correccion
    -- de un envio inicial va en metadata.es_correccion.
    INSERT INTO public.auditoria_casos (
        id_caso, id_usuario, accion, descripcion, metadata, created_at
    ) VALUES (
        p_id_caso,
        p_usuario_id,
        'entrevista',
        CASE WHEN p_es_correccion
             THEN 'El estudiante aplicó correcciones al caso y lo envió para revisión.'
             ELSE 'El estudiante completó la entrevista y envió el caso para aprobación del asesor.'
        END,
        jsonb_build_object('es_correccion', p_es_correccion, 'cambios', p_cambios),
        now()
    );
END;
$$;
