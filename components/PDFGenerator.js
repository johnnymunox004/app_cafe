import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default async function generatePDF(chartUri, { ratings, flavors, info }) {
  try {
    if (!chartUri) {
      throw new Error('URI del gráfico no disponible');
    }

    const chartBase64 = chartUri.startsWith('data:image') 
      ? chartUri.split(',')[1] 
      : chartUri;

    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              padding: 30px; 
              max-width: 800px; 
              margin: 0 auto;
              color: #2D3436;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 3px solid #FF9432;
              padding-bottom: 15px;
            }
            .title { 
              color: #2D3436; 
              font-size: 24px;
              font-weight: 700;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .subtitle {
              color: #636E72;
              font-size: 14px;
              margin-top: 5px;
            }
            .date { 
              color: #636E72;
              font-size: 12px;
              margin-top: 5px;
            }
            .content-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .info-section {
              background: #FFFFFF;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .section-title {
              color: #FF9432;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 15px;
              border-bottom: 2px solid #FFE8D3;
              padding-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: auto 1fr;
              gap: 10px;
              align-items: baseline;
            }
            .info-label {
              font-weight: 600;
              color: #2D3436;
              font-size: 12px;
            }
            .info-value {
              color: #636E72;
              font-size: 12px;
            }
            .chart-container { 
              width: 100%;
              max-width: 300px; /* Reducido de 500px */
              margin: 15px auto;
              padding: 15px;
              background: #FFFFFF;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .chart-title {
              color: #2D3436;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              margin-bottom: 10px;
            }
            .chart-image { 
              width: 100%;
              max-width: 250px; /* Reducido */
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .ratings-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
              gap: 10px;
              margin-top: 15px;
            }
            .rating-card {
              background: #FFF8F1;
              padding: 10px;
              border-radius: 6px;
              text-align: center;
            }
            .rating-value {
              font-size: 18px;
              font-weight: bold;
              color: #FF9432;
              margin-bottom: 3px;
            }
            .rating-label {
              color: #636E72;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .flavors-container {
              margin-top: 15px;
            }
            .flavors-title {
              color: #2D3436;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .flavors-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            .flavor-tag {
              background: #FF9432;
              color: white;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
            }
            .notes-section {
              margin-top: 15px;
              padding: 10px;
              background: #FFF8F1;
              border-radius: 6px;
              border-left: 3px solid #FF9432;
            }
            .notes-title {
              color: #2D3436;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .notes-content {
              font-size: 12px;
              color: #636E72;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #636E72;
              font-size: 10px;
              padding-top: 10px;
              border-top: 1px solid #FFE8D3;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Evaluación de Café</h1>
            <p class="subtitle">Análisis Detallado de Catación</p>
            <p class="date">${new Date().toLocaleDateString("es-ES", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>

          <div class="content-grid">
            <div class="info-section">
              <h2 class="section-title">Información del Café</h2>
              <div class="info-grid">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${info.name || 'No especificado'}</span>
                
                <span class="info-label">Origen:</span>
                <span class="info-value">${info.origin || 'No especificado'}</span>
              </div>

              ${info.notes ? `
                <div class="notes-section">
                  <h3 class="notes-title">Notas del Catador</h3>
                  <p class="notes-content">${info.notes}</p>
                </div>
              ` : ''}
            </div>

            <div class="chart-container">
              <h2 class="chart-title">Perfil de Sabor</h2>
              <img 
                src="data:image/png;base64,${chartBase64}" 
                alt="Gráfico de evaluación"
                class="chart-image"
              />
            </div>
          </div>

          <div class="ratings-grid">
            ${Object.entries(ratings || {})
              .map(([key, value]) => `
                <div class="rating-card">
                  <div class="rating-value">${value}/10</div>
                  <div class="rating-label">${key}</div>
                </div>
              `)
              .join("")}
          </div>

          ${flavors && flavors.length > 0 ? `
            <div class="flavors-container">
              <h3 class="flavors-title">Sabores Identificados</h3>
              <div class="flavors-grid">
                ${flavors.map(flavor => `
                  <span class="flavor-tag">${flavor}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p>Generado por Coffee App • ${new Date().toLocaleString("es-ES")}</p>
          </div>
        </body>
      </html>
    `;

    console.log('Generando PDF...');
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      throw new Error("Compartir no está disponible en este dispositivo");
    }

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