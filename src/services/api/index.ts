// src/services/api/index.ts
import { dataService as mockService } from './MockDataService';
// import { dataService as sqlService } from './SqlDataService'; // Futuro serviço real

/**
 * Quando você tiver sua API pronta, basta trocar 'mockService' por 'sqlService' aqui.
 * O restante do aplicativo não precisará de nenhuma alteração.
 */
export const api = mockService;
