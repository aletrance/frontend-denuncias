import { z } from 'zod';

// Nocodb Environment Configuration
export const nocodbConfig = {
    apiUrl: process.env.NOCODB_API_URL || 'http://10.19.239.158:8080/api/v2/tables/b3fl5rz6pdfmxfp/records',
    apiToken: process.env.NOCODB_API_TOKEN || '', // Add the token in the env later if required
};

// Validation Schema for updating a Denuncia
export const updateDenunciaSchema = z.object({
    plantilla_aplicar: z.coerce.number().min(1).max(7, 'El valor de plantilla debe estar entre 1 y 7'),
});
