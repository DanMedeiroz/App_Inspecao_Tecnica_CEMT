// src/services/api/DataService.ts
import { Obra, Inspecao, Pavimento, Item, Funcionario, Documento } from '../../types';

/**
 * Esta interface define todos os métodos que o App precisa para funcionar.
 * Quando você tiver sua API/Banco real, basta criar uma classe que implemente esta interface.
 */
export interface IDataService {
  // Obras
  getObras(): Promise<Obra[]>;
  getObraById(id: string): Promise<Obra | undefined>;
  updateObra(id: string, data: Partial<Obra>): Promise<void>;

  // Inspeções (Checklists no SQL)
  getInspecoesByObra(obraId: string): Promise<Inspecao[]>;
  getInspecaoById(id: string): Promise<Inspecao | undefined>;
  createInspecao(data: Partial<Inspecao>): Promise<Inspecao>;
  updateInspecao(id: string, data: Partial<Inspecao>): Promise<void>;

  // Pavimentos
  getPavimentosByObra(obraId: string): Promise<Pavimento[]>;
  updatePavimento(id: string, data: Partial<Pavimento>): Promise<void>;

  // Itens (Inconformidades)
  getItensByPavimento(pavimentoId: string): Promise<Item[]>;
  getItemById(id: string): Promise<Item | undefined>;
  saveItem(id: string, data: Partial<Item>): Promise<void>;

  // Funcionários e Documentos
  getFuncionariosByObra(obraId: string): Promise<Funcionario[]>;
  getDocumentosVencendo(): Promise<any[]>; // Simplificado para o exemplo
}
