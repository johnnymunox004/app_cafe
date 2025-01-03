import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export default async function generatePDF(chartUri, { ratings, flavors, info }) {
  try {
    if (!chartUri) {
      throw new Error('URI del gráfico no disponible');
    }

    console.log('Tipo de URI recibida:', typeof chartUri);
    console.log('URI comienza con:', chartUri.substring(0, 50));

    // Asegurarnos de que tenemos una cadena base64 válida
    const chartBase64 = chartUri.startsWith('data:image') 
      ? chartUri.split(',')[1] 
      : chartUri;

    // Verificar que tenemos datos válidos
    if (!chartBase64) {
      throw new Error('No se pudo obtener los datos base64 de la imagen');
    }

    console.log('Longitud de base64:', chartBase64.length);

    // Template HTML mejorado
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Helvetica, Arial, sans-serif; 
              padding: 20px; 
              max-width: 800px; 
              margin: 0 auto; 
            }
            .title { 
              color: #FF9432; 
              text-align: center; 
              font-size: 24px; 
              margin-bottom: 20px; 
              padding-bottom: 10px;
              border-bottom: 2px solid #FFE8D3;
            }
            .info-section {
              margin: 20px 0;
              padding: 15px;
              background: #FFF8F1;
              border-radius: 8px;
            }
            .info-item {
              margin: 10px 0;
            }
            .info-label {
              font-weight: bold;
              color: #433D3A;
            }
            .chart-container { 
              text-align: center; 
              margin: 20px auto;
              padding: 15px;
              background: #FFF8F1;
              border-radius: 8px;
              width: 80%;
              max-width: 400px;
            }
            .chart-image { 
              width: 100%;
              max-width: 300px;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .ratings {
              margin-top: 30px;
            }
            .rating { 
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #FFE8D3;
            }
            .rating-label {
              font-weight: bold;
              color: #433D3A;
            }
            .rating-value {
              color: #FF9432;
              font-weight: bold;
            }
            .flavors {
              margin: 20px 0;
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .flavor-tag {
              background: #FF9432;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 14px;
            }
            .date { 
              color: #666; 
              text-align: center; 
              margin: 10px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1 class="title">Evaluación de Café</h1>
          
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Nombre del café:</span> ${info.name || 'No especificado'}
            </div>
            <div class="info-item">
              <span class="info-label">Origen:</span> ${info.origin || 'No especificado'}
            </div>
            <div class="info-item">
              <span class="info-label">Notas:</span> ${info.notes || 'Sin notas adicionales'}
            </div>
          </div>

          <div class="chart-container">
            <img 
              src="data:image/png;base64,${chartBase64}" 
              alt="Gráfico de evaluación"
              class="chart-image"
            />
          </div>

          <div class="ratings">
            ${Object.entries(ratings)
              .map(
                ([key, value]) => `
                <div class="rating">
                  <span class="rating-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span class="rating-value">${value}/10</span>
                </div>
              `
              )
              .join("")}
          </div>

          <div class="info-section">
            <span class="info-label">Sabores identificados:</span>
            <div class="flavors">
              ${flavors.map(flavor => `<span class="flavor-tag">${flavor}</span>`).join(' ')}
            </div>
          </div>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleString("es-ES")}</p>
          </div>
        </body>
      </html>
    `;

    // Generar PDF con logging adicional
    console.log('Generando PDF...');
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    console.log('PDF generado en:', uri);

    // Verificar disponibilidad de compartir
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      throw new Error("Compartir no está disponible en este dispositivo");
    }

    // Compartir PDF
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Compartir evaluación de café",
      UTI: "com.adobe.pdf",
    });

    return { success: true };
  } catch (error) {
    console.error("Error en generatePDF:", error);
    return { success: false, error };
  }
}
