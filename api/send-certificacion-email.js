const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      nombre_vendedor,
      telefono,
      email,
      ubicacion,
      hectareas,
      fecha_inspeccion,
      observaciones
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

    // Template HTML para email al admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Solicitud de Certificación</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .label { font-weight: bold; color: #f59e0b; }
          .price-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ Nueva Solicitud de Certificación</h1>
          <h2>Tunel Usado Gold</h2>
        </div>

        <div class="content">
          <div class="price-box">
            <h3>💰 Inversión: $5,800 MXN (incluye IVA)</h3>
            <p>• $5,000 MXN + IVA 16% = $800 MXN</p>
          </div>

          <div class="section">
            <h3>Información del Solicitante</h3>
            <p><span class="label">Nombre:</span> ${nombre_vendedor}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Teléfono:</span> ${telefono}</p>
          </div>

          <div class="section">
            <h3>Información del Macrotúnel</h3>
            <p><span class="label">Ubicación:</span> ${ubicacion}</p>
            ${hectareas ? `<p><span class="label">Hectáreas:</span> ${hectareas}</p>` : ''}
            ${fecha_inspeccion ? `<p><span class="label">Fecha preferida para inspección:</span> ${fecha_inspeccion}</p>` : ''}
          </div>

          ${observaciones ? `
          <div class="section">
            <h3>Observaciones</h3>
            <p>${observaciones}</p>
          </div>
          ` : ''}

          <div class="section">
            <h3>📞 Recordatorio de Contacto</h3>
            <p>Contactar al solicitante en las próximas 24 horas para coordinar la inspección técnica.</p>
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
      subject: "🛡️ Nueva Solicitud de Certificación Tunel Usado",
      html: adminEmailHtml
    });

    // Template HTML para confirmación al cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Solicitud de Certificación Recibida</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; max-width: 600px; margin: 0 auto; }
          .success-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .steps { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .step { margin-bottom: 10px; }
          .step-number { display: inline-block; background: #0ea5e9; color: white; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: bold; margin-right: 10px; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
          .highlight { color: #f59e0b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Solicitud Recibida</h1>
          <h2>Certificación Tunel Usado Gold</h2>
        </div>

        <div class="content">
          <div class="success-box">
            <h3>¡Gracias por solicitar la certificación, ${nombre_vendedor}!</h3>
            <p>Hemos recibido tu solicitud para certificar tu macrotúnel. Este proceso aumentará el valor de tu propiedad hasta en un 15%.</p>
          </div>

          <div class="steps">
            <h3>📋 Próximos Pasos</h3>
            <div class="step">
              <span class="step-number">1</span>
              <strong>Contacto inicial:</strong> Te contactaremos en las próximas 24 horas para coordinar la inspección
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <strong>Inspección técnica:</strong> Nuestro equipo visitará tu macrotúnel para evaluación completa
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <strong>Evaluación detallada:</strong> Revisaremos estructura, plástico, condiciones generales
            </div>
            <div class="step">
              <span class="step-number">4</span>
              <strong>Certificado digital:</strong> Recibirás tu certificado con QR verificable en 48 horas
            </div>
          </div>

          <p>La certificación incluye:</p>
          <ul>
            <li>Reporte técnico detallado con fotos</li>
            <li>Medidas y especificaciones completas</li>
            <li>Estado actual de conservación</li>
            <li>Certificado digital verificable</li>
            <li>Badge "Certificado Gold" en tu listado</li>
          </ul>

          <p>Si tienes alguna pregunta o necesitas modificar la información proporcionada, puedes responder a este email.</p>

          <p>¡Gracias por elegir la certificación Tunel Usado Gold!</p>
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
      subject: "✅ Solicitud de Certificación Recibida - Tunel Usado",
      html: clientEmailHtml
    });

    res.status(200).json({ success: true, message: 'Emails enviados exitosamente' });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Error al enviar los emails', details: error.message });
  }
}