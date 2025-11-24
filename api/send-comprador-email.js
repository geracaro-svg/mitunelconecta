const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      nombre,
      email,
      telefono,
      hectareas,
      zona,
      lat,
      lon,
      tipo,
      comentarios,
      para_cultivo,
      cuando_inicia,
      tiene_financiamiento,
      primera_vez_tuneles,
      tuneles_existentes,
      prioridad_principal,
      presupuesto,
      cuando_decide
    } = req.body;

    // Configurar transporter SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Template HTML para email al admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo Comprador Registrado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .label { font-weight: bold; color: #3b82f6; }
          .maps-link { color: #2563eb; text-decoration: none; font-weight: bold; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛒 Nuevo Comprador Registrado</h1>
          <h2>${nombre} - Busca ${hectareas} ha (${tipo})</h2>
        </div>

        <div class="content">
          <div class="section">
            <h3>Información Personal</h3>
            <p><span class="label">Nombre:</span> ${nombre}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Teléfono:</span> ${telefono}</p>
          </div>

          <div class="section">
            <h3>Requerimientos del Proyecto</h3>
            <p><span class="label">Hectáreas necesarias:</span> ${hectareas}</p>
            <p><span class="label">Tipo de estructura:</span> ${tipo === 'nueva' ? 'Nueva' : tipo === 'usada' ? 'Usada' : 'Cualquiera'}</p>
            <p><span class="label">Para cultivo:</span> ${para_cultivo || 'No especificado'}</p>
            <p><span class="label">Cuándo planea iniciar:</span> ${cuando_inicia === 'esta_semana' ? 'Esta semana' : cuando_inicia === 'este_mes' ? 'Este mes' : cuando_inicia === 'este_trimestre' ? 'Este trimestre' : 'Este año'}</p>
            ${presupuesto ? `<p><span class="label">Presupuesto aproximado:</span> $${presupuesto} MXN</p>` : ''}
          </div>

          <div class="section">
            <h3>Experiencia</h3>
            <p><span class="label">Primera vez con macrotúneles:</span> ${primera_vez_tuneles === 'si' ? 'Sí' : 'No'}</p>
            ${tuneles_existentes ? `<p><span class="label">Túneles existentes:</span> ${tuneles_existentes}</p>` : ''}
          </div>

          <div class="section">
            <h3>Decisión y Financiamiento</h3>
            <p><span class="label">Prioridad principal:</span> ${prioridad_principal === 'precio' ? 'Precio' : prioridad_principal === 'calidad' ? 'Calidad' : prioridad_principal === 'rapidez' ? 'Rapidez' : 'Garantía'}</p>
            <p><span class="label">Cuándo piensa decidir:</span> ${cuando_decide === 'esta_semana' ? 'Esta semana' : cuando_decide === 'este_mes' ? 'Este mes' : cuando_decide === 'este_trimestre' ? 'Este trimestre' : 'Sin prisa'}</p>
            <p><span class="label">Financiamiento:</span> ${tiene_financiamiento === 'si' ? 'Ya tiene' : tiene_financiamiento === 'en_proceso' ? 'En proceso' : tiene_financiamiento === 'no' ? 'Paga de contado' : 'Necesita financiamiento'}</p>
          </div>

          <div class="section">
            <h3>Ubicación</h3>
            <p><span class="label">Zona:</span> ${zona}</p>
            <p><span class="label">Coordenadas:</span> ${lat}, ${lon}</p>
            <p><a href="https://www.google.com/maps?q=${lat},${lon}" class="maps-link">Ver en Google Maps</a></p>
          </div>

          ${comentarios ? `
          <div class="section">
            <h3>Comentarios Adicionales</h3>
            <p>${comentarios}</p>
          </div>
          ` : ''}

          <div class="section">
            <h3>📞 Recordatorio de Contacto</h3>
            <p>Contactar al comprador en las próximas 24 horas para presentar opciones disponibles.</p>
          </div>
        </div>

        <div class="footer">
          <p>Este email fue generado automáticamente por Tunel Usado</p>
        </div>
      </body>
      </html>
    `;

    // Enviar email al admin
    await transporter.sendMail({
      from: `"Tunel Usado" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 Nuevo Comprador: ${nombre} - Busca ${hectareas} ha (${tipo})`,
      html: adminEmailHtml
    });

    // Template HTML para confirmación al cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Solicitud Recibida - Tunel Usado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; max-width: 600px; margin: 0 auto; }
          .success-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .contact-info { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
          .highlight { color: #3b82f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Solicitud Recibida</h1>
          <h2>Tunel Usado</h2>
        </div>

        <div class="content">
          <div class="success-box">
            <h3>¡Gracias por tu interés, ${nombre}!</h3>
            <p>Hemos recibido tu solicitud para ${hectareas} hectáreas de macrotúnel${tipo === 'nueva' ? ' nueva' : tipo === 'usada' ? ' usada' : ''}.</p>
          </div>

          <p>Tu solicitud ha sido registrada y nuestro equipo está buscando las mejores opciones disponibles en tu zona.</p>

          <div class="contact-info">
            <h3>📞 Próximos Pasos</h3>
            <p>Te contactaremos en las próximas <span class="highlight">24 horas</span> para:</p>
            <ul>
              <li>Presentarte macrotúneles disponibles que cumplan tus requerimientos</li>
              <li>Coordinar visitas a las propiedades</li>
              <li>Asistirte con financiamiento si es necesario</li>
              <li>Guiarte en el proceso de compra</li>
            </ul>
          </div>

          <p>Si tienes alguna pregunta o necesitas modificar tu solicitud, puedes responder a este email.</p>

          <p>¡Gracias por elegir Tunel Usado!</p>
        </div>

        <div class="footer">
          <p>Este es un email automático - No responder directamente</p>
          <p>Para contactarnos: hola@tunnelconecta.com</p>
        </div>
      </body>
      </html>
    `;

    // Enviar email de confirmación al cliente
    await transporter.sendMail({
      from: `"Tunel Usado" <${process.env.SMTP_USER}>`,
      to: email,
      bcc: process.env.ADMIN_EMAIL,
      subject: "✅ Solicitud Recibida - Tunel Usado",
      html: clientEmailHtml
    });

    res.status(200).json({ success: true, message: 'Emails enviados exitosamente' });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Error al enviar los emails', details: error.message });
  }
}