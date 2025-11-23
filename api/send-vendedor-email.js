const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      nombre,
      email,
      telefono,
      hectareas,
      anios_uso,
      plastico,
      plastico_edad,
      ubicacion_texto,
      lat,
      lon,
      fotos_base64,
      fecha_compra_original,
      proveedor_original,
      precio_compra_original,
      cultivos_sembrados,
      motivo_venta,
      urgencia_venta,
      expectativa_precio,
      factura_file
    } = req.body;

    // Configurar transporter SMTP
    const transporter = nodemailer.createTransporter({
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

    // Preparar adjuntos de fotos
    const attachments = [];
    if (fotos_base64 && fotos_base64.length > 0) {
      fotos_base64.forEach((foto, index) => {
        if (foto) {
          // Remover el prefijo data:image/...;base64,
          const base64Data = foto.split(',')[1];
          attachments.push({
            filename: `foto_${index + 1}.jpg`,
            content: Buffer.from(base64Data, 'base64'),
            contentType: 'image/jpeg'
          });
        }
      });
    }

    // Preparar adjunto de factura si existe
    if (factura_file) {
      const base64Data = factura_file.split(',')[1];
      attachments.push({
        filename: 'factura.pdf',
        content: Buffer.from(base64Data, 'base64'),
        contentType: 'application/pdf'
      });
    }

    // Template HTML para email al admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo Vendedor Registrado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .label { font-weight: bold; color: #10b981; }
          .urgent { color: #dc2626; font-weight: bold; }
          .maps-link { color: #2563eb; text-decoration: none; font-weight: bold; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Nuevo Vendedor Registrado</h1>
          <h2>${nombre} - ${hectareas} ha</h2>
        </div>

        <div class="content">
          <div class="section">
            <h3>Información Personal</h3>
            <p><span class="label">Nombre:</span> ${nombre}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Teléfono:</span> ${telefono}</p>
          </div>

          <div class="section">
            <h3>Información del Macrotúnel</h3>
            <p><span class="label">Hectáreas:</span> ${hectareas}</p>
            <p><span class="label">Años de uso:</span> ${anios_uso}</p>
            <p><span class="label">Plástico incluido:</span> ${plastico === 'sí' ? 'Sí' : 'No'}${plastico === 'sí' && plastico_edad ? ` (${plastico_edad} años)` : ''}</p>
            <p><span class="label">Cultivos sembrados:</span> ${cultivos_sembrados || 'No especificado'}</p>
          </div>

          <div class="section">
            <h3>Ubicación</h3>
            <p><span class="label">Zona:</span> ${ubicacion_texto}</p>
            <p><span class="label">Coordenadas:</span> ${lat}, ${lon}</p>
            <p><a href="https://www.google.com/maps?q=${lat},${lon}" class="maps-link">Ver en Google Maps</a></p>
          </div>

          ${fecha_compra_original || precio_compra_original || proveedor_original ? `
          <div class="section">
            <h3>Historial de Compra</h3>
            ${fecha_compra_original ? `<p><span class="label">Fecha de compra:</span> ${fecha_compra_original}</p>` : ''}
            ${proveedor_original ? `<p><span class="label">Proveedor:</span> ${proveedor_original}</p>` : ''}
            ${precio_compra_original ? `<p><span class="label">Precio original:</span> $${precio_compra_original} MXN</p>` : ''}
          </div>
          ` : ''}

          <div class="section">
            <h3>Información de Venta</h3>
            <p><span class="label">Motivo de venta:</span> ${motivo_venta}</p>
            <p><span class="label">Urgencia:</span> <span class="${urgencia_venta === 'urgente' ? 'urgent' : ''}">${urgencia_venta === 'urgente' ? 'URGENTE (esta semana)' : urgencia_venta === '1_mes' ? 'En 1 mes' : urgencia_venta === '3_meses' ? 'En 3 meses' : 'Flexible'}</span></p>
            ${expectativa_precio ? `<p><span class="label">Expectativa de precio:</span> $${expectativa_precio} MXN</p>` : ''}
          </div>

          <div class="section">
            <h3>📞 Recordatorio de Contacto</h3>
            <p>Contactar al vendedor en las próximas 24 horas para evaluar el macrotúnel.</p>
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
      subject: `🌱 Nuevo Vendedor: ${nombre} - ${hectareas} ha`,
      html: adminEmailHtml,
      attachments: attachments
    });

    // Template HTML para confirmación al cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Registro Exitoso - Tunel Usado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; max-width: 600px; margin: 0 auto; }
          .success-box { background: #d1fae5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .contact-info { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
          .highlight { color: #10b981; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Registro Exitoso</h1>
          <h2>Tunel Usado</h2>
        </div>

        <div class="content">
          <div class="success-box">
            <h3>¡Gracias por registrarte, ${nombre}!</h3>
            <p>Hemos recibido exitosamente la información de tu macrotúnel de ${hectareas} hectáreas.</p>
          </div>

          <p>Tu solicitud ha sido registrada y nuestro equipo de expertos evaluará la información proporcionada.</p>

          <div class="contact-info">
            <h3>📞 Próximos Pasos</h3>
            <p>Te contactaremos en las próximas <span class="highlight">24 horas</span> para:</p>
            <ul>
              <li>Agendar una visita de evaluación</li>
              <li>Revisar las condiciones del macrotúnel</li>
              <li>Realizar una valuación precisa</li>
              <li>Presentarte opciones de compradores interesados</li>
            </ul>
          </div>

          <p>Si tienes alguna pregunta o necesitas modificar la información proporcionada, puedes responder a este email.</p>

          <p>¡Gracias por confiar en Tunel Usado!</p>
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
      subject: "✅ Registro Exitoso - Tunel Usado",
      html: clientEmailHtml
    });

    res.status(200).json({ success: true, message: 'Emails enviados exitosamente' });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Error al enviar los emails', details: error.message });
  }
}