// src/services/pdfGenerator.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import { INSPECOES_MOCK, ITENS_MOCK, OBRAS_MOCK, PAVIMENTOS_MOCK } from '../constants/mockData';

const LOGO_CEMT = "https://www.clinicacostaesmeralda.com.br/layouts/clinicacostaesmeralda/assets/images/logo.png";

export const generateInspecaoPDF = async (inspecaoId: string) => {
  try {
    // 1. Buscar e Cruzar os Dados
    const inspecao = INSPECOES_MOCK.find(i => i.id === inspecaoId);
    if (!inspecao) throw new Error("Inspeção não encontrada");

    const obra = OBRAS_MOCK.find(o => o.id === inspecao.obraId);
    if (!obra) throw new Error("Obra não encontrada");

    // Pavimentos ordenados
    const pavimentos = PAVIMENTOS_MOCK
      .filter(p => p.inspecaoId === inspecaoId)
      .sort((a, b) => a.ordem - b.ordem);

    // 2. Helpers de Data
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateStr: string) => {
      return new Date(dateStr).toLocaleString('pt-BR');
    };

    // 3. Construção do HTML
    // Aqui definimos o CSS para impressão (quebras de página, fontes, grids)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { margin: 20px; }
          body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; }
          
          /* Classes Utilitárias */
          .page-break { page-break-before: always; }
          .no-break { page-break-inside: avoid; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .mb-4 { margin-bottom: 16px; }
          .mt-4 { margin-top: 16px; }

          /* CAPA */
          .cover-container {
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px;
            border: 1px solid #ddd;
          }
          .cover-header { display: flex; justify-content: space-between; align-items: flex-start; }
          .logo { width: 120px; height: 120px; object-fit: contain; }
          .cover-title { font-size: 28px; color: #1F5F38; text-transform: uppercase; margin-top: 40px; }
          .cover-subtitle { font-size: 18px; color: #555; margin-top: 10px; }
          
          .cover-image-container { 
            width: 100%; height: 300px; overflow: hidden; margin: 30px 0; border-radius: 8px; border: 1px solid #eee;
          }
          .cover-image { width: 100%; height: 100%; object-fit: cover; }

          .cover-info { background-color: #f9fafb; padding: 20px; border-radius: 8px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .intro-text { font-size: 12px; text-align: justify; line-height: 1.5; margin-top: 20px; color: #444; }

          /* CABEÇALHO INTERNO (Repete visualmente, mas HTML não suporta header fixo nativo fácil em PDF móvel, faremos inline) */
          .header-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            border-bottom: 2px solid #1F5F38;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 10px;
            color: #555;
          }

          /* CONTEÚDO */
          .pavimento-title {
            background-color: #1F5F38; color: white; padding: 8px 12px;
            font-size: 16px; font-weight: bold; text-transform: uppercase;
            margin-top: 20px; border-radius: 4px;
          }

          .item-container {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            margin-top: 10px;
            background-color: #fff;
          }

          .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .item-title { font-size: 14px; font-weight: bold; color: #111; }
          .item-norma { font-family: 'Courier New', monospace; font-size: 11px; background: #f3f4f6; padding: 4px; border-radius: 4px; margin-bottom: 8px; display: block; }
          .item-obs { font-size: 12px; color: #444; font-style: italic; margin-bottom: 10px; }

          /* FOTOS GRID */
          .photos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .photo-wrapper { position: relative; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; height: 200px; }
          .photo-img { width: 100%; height: 100%; object-fit: cover; }
          .photo-date {
            position: absolute; bottom: 0; left: 0; right: 0;
            background: rgba(0,0,0,0.6); color: white;
            font-size: 10px; padding: 4px; text-align: center;
          }

          /* RODAPÉ */
          .footer {
            margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px;
            font-size: 10px; color: #777; display: flex; justify-content: space-between;
          }
        </style>
      </head>
      <body>

        <div class="cover-container">
          <div>
            <div class="cover-header">
              ${obra.empresaLogo ? `<img src="${obra.empresaLogo}" class="logo" />` : '<div></div>'}
              <div class="text-right">
                <div style="font-size: 12px; color: #888;">Relatório Técnico</div>
                <div style="font-size: 12px; font-weight: bold;">${formatDate(inspecao.data)}</div>
              </div>
            </div>

            <div class="cover-title">${obra.nome}</div>
            <div class="cover-subtitle">${obra.endereco}</div>

            ${inspecao.fotoCapa ? `
              <div class="cover-image-container">
                <img src="${inspecao.fotoCapa}" class="cover-image" />
              </div>
            ` : ''}

            <div class="cover-info">
              <div class="info-row">
                <span class="text-bold">Cliente:</span> <span>${obra.empresaNome}</span>
              </div>
              <div class="info-row">
                <span class="text-bold">Técnico Responsável:</span> <span>${inspecao.tecnico}</span>
              </div>
              <div class="info-row">
                <span class="text-bold">Contato:</span> <span>${obra.empresaTelefone || '-'} / ${obra.empresaEmail || '-'}</span>
              </div>
            </div>

            <div class="intro-text">
              ${inspecao.descricao || 'Nenhuma descrição informada.'}
            </div>
          </div>

          <div class="text-center" style="font-size: 10px; color: #999;">
            Gerado via App CEMT - Gestão de Segurança do Trabalho
          </div>
        </div>

        <div class="page-break"></div>

        <div class="header-grid">
          <div><b>Técnico:</b> ${inspecao.tecnico}</div>
          <div><b>Criada em:</b> ${formatDate(inspecao.data)}</div>
          <div><b>Empresa:</b> ${obra.empresaNome}</div>
          <div><b>Local:</b> ${obra.nome}</div>
          <div><b>Contato:</b> ${obra.empresaTelefone || '-'}</div>
          <div><b>Status:</b> ${inspecao.status}</div>
        </div>

        ${pavimentos.map((pavimento, pIndex) => {
          // Filtra itens deste pavimento
          const itens = ITENS_MOCK.filter(i => i.pavimentoId === pavimento.id);
          
          if (itens.length === 0) return ''; // Pula pavimento vazio

          return `
            <div class="no-break">
              <div class="pavimento-title">${pavimento.ordem + 1}. ${pavimento.nome}</div>
              
              ${itens.map((item, iIndex) => `
                <div class="item-container no-break">
                  <div class="item-header">
                    <span class="item-title">${pIndex + 1}.${iIndex + 1} - ${item.tituloInconformidade}</span>
                  </div>
                  
                  <div class="item-norma">Norma: ${item.artigosNorma}</div>
                  
                  ${item.observacoes ? `<div class="item-obs">Obs: ${item.observacoes}</div>` : ''}

                  ${item.fotos.length > 0 ? `
                    <div class="photos-grid">
                      ${item.fotos.map(foto => `
                        <div class="photo-wrapper">
                          <img src="${foto.uri}" class="photo-img" />
                          <div class="photo-date">${foto.data}</div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}

        <div class="footer">
          <div>
            <b>${obra.empresaNome}</b><br/>
            ${obra.endereco}
          </div>
          <div class="text-right">
            <img src="${LOGO_CEMT}" style="width: 30px; height: 30px; vertical-align: middle; margin-bottom: 5px;" />
            <br/>
            <b>Clinica Costa Esmeralda (CEMT)</b><br/>
            Gestão Inteligente de Segurança
          </div>
        </div>

      </body>
      </html>
    `;

    // 4. Gerar o Arquivo PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    console.log('PDF gerado em:', uri);

    // 5. Compartilhar/Salvar
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Relatório - ${obra.nome}`
      });
    } else {
      Alert.alert("PDF Gerado", `Arquivo salvo em: ${uri}`);
    }

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    Alert.alert("Erro", "Não foi possível gerar o relatório PDF. Verifique os logs.");
  }
};