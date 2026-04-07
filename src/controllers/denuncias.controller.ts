import { Request, Response } from 'express';
import pool from '../config/db.config';
import { updateDenunciaSchema } from '../config/nocodb.config';

export interface Denuncia {
    Id: number;
    nombre_archivo?: string;
    prioritario?: boolean | string;
    estado?: string;
    plantilla_aplicar?: number;
    c_numero_expediente?: string;
    fecha_ingreso?: string | Date;
    v_nombre_completo?: string;
    d_nombre_completo?: string;
    categoria_sugerida?: string;
    usuario_validador?: string;
    fecha_firma?: string | Date;
    justificacion?: string;
    v_dni?: string;
    v_telefono?: string;
    d_dni?: string;
    vinculo_partes?: string;
    c_fecha_hechos?: string | Date;
    c_numero_comisaria?: string;
    c_numero_denuncia_policial?: string;
    c_tipo_violencia?: string;
    c_modalidad_violencia?: string;
    hay_antecedentes_violencia?: boolean | string;
    descripcion_amenazas?: string;
    m_solicita_abstencion_actos_violencia?: boolean | string;
    m_solicita_prohibicion_acercamiento?: boolean | string;
    m_distancia_metros?: number;
    m_solicita_exclusion_hogar?: boolean | string;
    m_solicita_reintegro_efectos_personales?: string;
    m_solicita_alimentos_provisorios?: boolean | string;
    m_solicita_boton_antipanico?: boolean | string;
    m_solicita_custodia_policial?: string;
    triage_activadores?: string;
    triage_evidencia?: string;
    clasificacion_criterio?: string;
    clasificacion_evidencia?: string;
    triage_justificacion?: string;
    defensoria_numero?: string;
    telefonos_defensoria?: string;
    celular_defensoria?: string;
    telefono_polo_mujer?: string;
    telefono_turno?: string;
    celular_turno?: string;
    resumen_preliminar?: string;
}

/**
 * Render the Denuncias view with data from PostgreSQL
 */
export const getDenuncias = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT * FROM (
                SELECT DISTINCT ON (COALESCE(nombre_archivo, id::text))
                    id AS "Id", nombre_archivo, prioritario, estado, plantilla_aplicar, 
                    c_numero_expediente, fecha_ingreso, v_nombre_completo, d_nombre_completo,
                    categoria_sugerida, usuario_validador, fecha_firma, justificacion,
                    v_dni, v_telefono, d_dni, vinculo_partes, c_fecha_hechos,
                    c_numero_comisaria, c_numero_denuncia_policial, c_tipo_violencia,
                    c_modalidad_violencia, hay_antecedentes_violencia, descripcion_amenazas,
                    m_solicita_abstencion_actos_violencia, m_solicita_prohibicion_acercamiento,
                    m_distancia_metros, m_solicita_exclusion_hogar, m_solicita_reintegro_efectos_personales,
                    m_solicita_alimentos_provisorios, m_solicita_boton_antipanico,
                    m_solicita_custodia_policial, triage_activadores, triage_evidencia,
                    clasificacion_criterio, clasificacion_evidencia, triage_justificacion,
                    defensoria_numero, telefonos_defensoria, celular_defensoria,
                    telefono_polo_mujer, telefono_turno, celular_turno, resumen_preliminar
                FROM denuncias 
                WHERE estado IS NULL OR estado != 'APROBADO'
                ORDER BY COALESCE(nombre_archivo, id::text), id DESC
            ) as sub
            ORDER BY "Id" DESC
            LIMIT 100
        `;
        
        const result = await pool.query<Denuncia>(query);
        const records = result.rows;

        res.render('denuncias', {
            username: req.session.username,
            denuncias: records,
            error: null
        });
    } catch (error) {
        console.error('Error fetching denuncias from PostgreSQL:', error);
        
        // No mock data here to encourage fixing the DB connection
        res.render('denuncias', {
            username: req.session.username,
            denuncias: [],
            error: `Error al conectar con la base de datos PostgreSQL: ${error instanceof Error ? error.message : 'Error desconocido'}`
        });
    }
};

/**
 * Handle PATCH request to update 'plantilla_aplicar' in PostgreSQL
 */
export const updateDenuncia = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        const id: string = Array.isArray(idParam) ? idParam[0] : idParam;
        const body = req.body;

        // Validate the request body
        const validatedData = updateDenunciaSchema.parse(body);

        const query = `
            UPDATE denuncias 
            SET plantilla_aplicar = $1, estado = $2
            WHERE id = $3
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            validatedData.plantilla_aplicar, 
            'APROBADO', 
            id
        ]);

        if (result.rowCount === 0) {
            throw new Error(`No se encontró la denuncia con ID ${id}`);
        }

        res.json({ success: true, message: 'Plantilla actualizada correctamente' });
    } catch (error) {
        console.error('Error updating denuncia in PostgreSQL:', error);
        res.status(400).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
