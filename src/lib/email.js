import { Resend } from 'resend';

const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY || process.env.RESEND_API_KEY);

export const sendClientConfirmationEmail = async (formData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'TunnelConecta <noreply@tunnelconecta.com>',
      to: [formData.email],
      subject: '¡Gracias por registrarte en TunnelConecta!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">¡Bienvenido a TunnelConecta!</h1>

          <p>Hola <strong>${formData.nombre}</strong>,</p>

          <p>¡Gracias por registrarte para vender tu macrotúnel en nuestra plataforma!</p>

          <p>Hemos recibido tu información y nuestro equipo de expertos evaluará tu macrotúnel en las próximas horas.</p>

          <p><strong>Te contactaremos en menos de 24 horas</strong> para discutir los detalles y próximos pasos.</p>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Tu información registrada:</h3>
            <ul style="color: #166534;">
              <li><strong>Hectáreas:</strong> ${formData.hectareas}</li>
              <li><strong>Ubicación:</strong> ${formData.ubicacion_texto}</li>
              <li><strong>Expectativa de precio:</strong> $${formData.expectativa_precio || 'No especificado'}</li>
            </ul>
          </div>

          <p>Si tienes alguna pregunta, no dudes en responder a este correo.</p>

          <p>¡Esperamos poder ayudarte pronto!</p>

          <p style="color: #6b7280; font-size: 14px;">
            Atentamente,<br>
            El equipo de TunnelConecta<br>
            contacto@tunnelconecta.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending client email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendClientConfirmationEmail:', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNotificationEmail = async (formData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tunnelconecta.com';

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'TunnelConecta <noreply@tunnelconecta.com>',
      to: [adminEmail],
      subject: `Nuevo registro de vendedor - ${formData.nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">🔔 Nuevo Registro de Vendedor</h1>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="color: #dc2626; margin-top: 0;">Información del Vendedor</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Nombre:</td><td>${formData.nombre}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${formData.email}">${formData.email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td><a href="tel:${formData.telefono}">${formData.telefono}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Hectáreas:</td><td>${formData.hectareas}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Años de uso:</td><td>${formData.anios_uso}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Ubicación:</td><td>${formData.ubicacion_texto}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Coordenadas:</td><td>${formData.lat ? `${formData.lat.toFixed(4)}, ${formData.lon.toFixed(4)}` : 'No capturadas'}</td></tr>
            </table>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Detalles del Macrotúnel</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Incluye plástico:</td><td>${formData.plastico === 'sí' ? 'Sí' : 'No'}</td></tr>
              ${formData.plastico === 'sí' ? `<tr><td style="padding: 8px 0; font-weight: bold;">Antigüedad del plástico:</td><td>${formData.plastico_edad} años</td></tr>` : ''}
              <tr><td style="padding: 8px 0; font-weight: bold;">Cultivos sembrados:</td><td>${formData.cultivos_sembrados || 'No especificado'}</td></tr>
            </table>
          </div>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Información de Venta</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Motivo de venta:</td><td>${formData.motivo_venta}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Expectativa de precio:</td><td>$${formData.expectativa_precio || 'No especificado'}</td></tr>
            </table>
          </div>

          ${formData.fecha_compra_original || formData.precio_compra_original || formData.proveedor_original ? `
          <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Historial de Compra (Opcional)</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${formData.fecha_compra_original ? `<tr><td style="padding: 8px 0; font-weight: bold;">Fecha de compra:</td><td>${formData.fecha_compra_original}</td></tr>` : ''}
              ${formData.precio_compra_original ? `<tr><td style="padding: 8px 0; font-weight: bold;">Precio de compra:</td><td>$${formData.precio_compra_original}</td></tr>` : ''}
              ${formData.proveedor_original ? `<tr><td style="padding: 8px 0; font-weight: bold;">Proveedor original:</td><td>${formData.proveedor_original}</td></tr>` : ''}
            </table>
          </div>
          ` : ''}

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">📞 Acción Requerida</h3>
            <p style="margin-bottom: 0;">Llama a <strong>${formData.nombre}</strong> al <a href="tel:${formData.telefono}" style="color: #2563eb;">${formData.telefono}</a> para coordinar la evaluación del macrotúnel.</p>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            Este es un mensaje automático generado por TunnelConecta
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending admin email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error);
    return { success: false, error: error.message };
  }
};