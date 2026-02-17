// src/services/api/MockDataService.ts
import { IDataService } from './DataService';
import { OBRAS_MOCK, INSPECOES_MOCK, PAVIMENTOS_MOCK, ITENS_MOCK, FUNCIONARIOS_MOCK } from '../../constants/mockData';
import { Obra, Inspecao, Pavimento, Item, Funcionario } from '../../types';

export class MockDataService implements IDataService {
  async getObras(): Promise<Obra[]> {
    return OBRAS_MOCK;
  }

  async getObraById(id: string): Promise<Obra | undefined> {
    return OBRAS_MOCK.find(o => o.id === id);
  }

  async updateObra(id: string, data: Partial<Obra>): Promise<void> {
    console.log(`[Mock] Atualizando obra ${id}`, data);
  }

  async getInspecoesByObra(obraId: string): Promise<Inspecao[]> {
    return INSPECOES_MOCK.filter(i => i.obra_id === obraId);
  }

  async getInspecaoById(id: string): Promise<Inspecao | undefined> {
    return INSPECOES_MOCK.find(i => i.id === id);
  }

  async createInspecao(data: Partial<Inspecao>): Promise<Inspecao> {
    const newInspecao = { ...data, id: Math.random().toString() } as Inspecao;
    console.log(`[Mock] Criando inspeção`, newInspecao);
    return newInspecao;
  }

  async updateInspecao(id: string, data: Partial<Inspecao>): Promise<void> {
    console.log(`[Mock] Atualizando inspeção ${id}`, data);
  }

  async getPavimentosByObra(obraId: string): Promise<Pavimento[]> {
    return PAVIMENTOS_MOCK.filter(p => p.obra_id === obraId);
  }

  async updatePavimento(id: string, data: Partial<Pavimento>): Promise<void> {
    console.log(`[Mock] Atualizando pavimento ${id}`, data);
  }

  async getItensByPavimento(pavimentoId: string): Promise<Item[]> {
    return ITENS_MOCK.filter(i => i.pavimento_id === pavimentoId);
  }

  async getItemById(id: string): Promise<Item | undefined> {
    return ITENS_MOCK.find(i => i.id === id);
  }

  async saveItem(id: string, data: Partial<Item>): Promise<void> {
    console.log(`[Mock] Salvando item ${id}`, data);
  }

  async getFuncionariosByObra(obraId: string): Promise<Funcionario[]> {
    return FUNCIONARIOS_MOCK.filter(f => f.empresa_id === obraId);
  }

  async getDocumentosVencendo(): Promise<any[]> {
    // Lógica simplificada para o mock
    return [];
  }
}

// Exportamos uma instância única (Singleton)
export const dataService: IDataService = new MockDataService();
