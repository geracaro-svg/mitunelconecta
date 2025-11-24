import { createClient } from '@supabase/supabase-js'
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from './emailService'
import { createLeadInZoho } from './zohoService'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Crear cliente de Supabase solo si las variables están configuradas
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Funciones para guardar datos de formularios
export const saveCompradorData = async (formData) => {
  if (!supabase) {
    console.warn('Supabase not configured - saving to console only')
    console.log('Comprador data:', formData)
    return { success: true, data: formData, mock: true }
  }

  try {
    const { data, error } = await supabase
      .from('tunnel_purchases')
      .insert([
        {
          contact_name: formData.nombre,
          contact_email: formData.email,
          contact_phone: formData.telefono,
          hectares_needed: parseFloat(formData.hectareas),
          location: formData.zona,
          latitude: formData.lat,
          longitude: formData.lon,
          tunnel_type: formData.tipo,
          crops: formData.para_cultivo,
          timeline: formData.cuando_inicia,
          budget: formData.presupuesto ? parseFloat(formData.presupuesto) : null,
          financing: formData.tiene_financiamiento,
          experience_years: formData.primera_vez_tuneles === 'no' ? 1 : 0, // Simplificado
          current_tunnels: parseInt(formData.tuneles_existentes) || 0,
          priority: formData.prioridad_principal,
          decision_timeline: formData.cuando_decide,
          comments: formData.comentarios
        }
      ])

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving comprador data:', error)
    return { success: false, error: error.message }
  }
}

export const saveVendedorData = async (formData) => {
  if (!supabase) {
    console.warn('Supabase not configured - saving to console only')
    console.log('Vendedor data:', formData)
    return { success: true, data: formData, mock: true }
  }

  try {
    const { data, error } = await supabase
      .from('tunnel_sales')
      .insert([
        {
          contact_name: formData.nombre,
          contact_email: formData.email,
          contact_phone: formData.telefono,
          hectares: parseFloat(formData.hectareas),
          location: formData.ubicacion_texto,
          latitude: formData.lat,
          longitude: formData.lon,
          plastic_included: formData.plastico === 'sí',
          plastic_age: formData.plastico_edad ? parseInt(formData.plastico_edad) : null,
          purchase_price: formData.precio_compra_original ? parseFloat(formData.precio_compra_original) : null,
          supplier: formData.proveedor_original,
          crops_grown: formData.cultivos_sembrados,
          reason_for_sale: formData.motivo_venta,
          expected_price: formData.expectativa_precio ? parseFloat(formData.expectativa_precio) : null,
          photos: formData.fotos_base64 || [],
          invoice_file: formData.factura_file
        }
      ])

    if (error) throw error

    // Send emails after successful database save
    console.log('About to send emails...')
    try {
      const [clientResult, adminResult] = await Promise.all([
        sendClientConfirmationEmail(formData),
        sendAdminNotificationEmail(formData)
      ])
      console.log('Emails sent successfully:', { clientResult, adminResult })
    } catch (emailError) {
      console.error('Error sending emails:', emailError)
      // Don't fail the submission if emails fail
    }

    // Create lead in Zoho CRM
    console.log('About to create Zoho lead...')
    try {
      const zohoResult = await createLeadInZoho(formData, 'vendedor')
      console.log('Zoho lead created successfully:', zohoResult)
    } catch (zohoError) {
      console.error('Error creating Zoho lead:', zohoError)
      // Don't fail the submission if Zoho fails
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error saving vendedor data:', error)
    return { success: false, error: error.message }
  }
}

export const saveCertificationData = async (formData) => {
  if (!supabase) {
    console.warn('Supabase not configured - saving to console only')
    console.log('Certification data:', formData)
    return { success: true, data: formData, mock: true }
  }

  try {
    const { data, error } = await supabase
      .from('certification_requests')
      .insert([
        {
          contact_name: formData.nombre_vendedor,
          contact_email: formData.email,
          contact_phone: formData.telefono,
          tunnel_location: formData.ubicacion,
          hectares: formData.hectareas ? parseFloat(formData.hectareas) : null,
          preferred_date: formData.fecha_inspeccion || null,
          observations: formData.observaciones,
          status: 'pending'
        }
      ])

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving certification data:', error)
    return { success: false, error: error.message }
  }
}