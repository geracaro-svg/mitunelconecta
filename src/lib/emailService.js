import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_tunnelconecta';
const TEMPLATE_ID_CLIENT = 'template_client_confirmation';
const TEMPLATE_ID_ADMIN = 'template_admin_notification';
const PUBLIC_KEY = 'your_emailjs_public_key_here';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export const sendClientConfirmationEmail = async (formData) => {
  try {
    console.log('Sending client confirmation email to:', formData.email);

    const templateParams = {
      to_email: formData.email,
      to_name: formData.nombre,
      from_name: 'TunnelConecta',
      reply_to: 'tunelusado@gmail.com',
      subject: '¡Gracias por registrarte en TunnelConecta!',

      // Client data
      client_name: formData.nombre,
      client_email: formData.email,
      client_phone: formData.telefono,
      hectares: formData.hectareas,
      location: formData.ubicacion_texto || formData.zona,
      expected_price: formData.expectativa_precio || 'No especificado',

      // Additional data for vendedor forms
      plastic_included: formData.plastico === 'sí' ? 'Sí' : 'No',
      supplier: formData.proveedor_original || 'No especificado',
      purchase_price: formData.precio_compra_original || 'No especificado',
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_CLIENT,
      templateParams
    );

    console.log('Client email sent successfully:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('Error sending client email:', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNotificationEmail = async (formData) => {
  try {
    console.log('Sending admin notification email');

    const templateParams = {
      to_email: 'tunelusado@gmail.com',
      from_name: 'TunnelConecta System',
      subject: `Nuevo registro - ${formData.nombre}`,

      // Complete form data
      client_name: formData.nombre,
      client_email: formData.email,
      client_phone: formData.telefono,
      hectares: formData.hectareas,
      location: formData.ubicacion_texto || formData.zona,
      expected_price: formData.expectativa_precio || 'No especificado',

      // Vendedor specific data
      plastic_included: formData.plastico === 'sí' ? 'Sí' : 'No',
      plastic_age: formData.plastico_edad || 'N/A',
      supplier: formData.proveedor_original || 'No especificado',
      purchase_price: formData.precio_compra_original || 'No especificado',
      crops_grown: formData.cultivos_sembrados || 'No especificado',
      reason_for_sale: formData.motivo_venta || 'No especificado',

      // Comprador specific data
      current_tunnels: formData.tuneles_existentes || 'No especificado',
      financing: formData.tiene_financiamiento || 'No especificado',
      priority: formData.prioridad_principal || 'No especificado',
      timeline: formData.cuando_decide || 'No especificado',
      comments: formData.comentarios || 'No especificado',

      // GPS data
      latitude: formData.lat || 'No capturado',
      longitude: formData.lon || 'No capturado',
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_ADMIN,
      templateParams
    );

    console.log('Admin email sent successfully:', result);
    return { success: true, data: result };

  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
};