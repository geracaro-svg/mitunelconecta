import { createClient } from '@supabase/supabase-js'
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from './emailService'

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
          photos: formData.fotos_base64 || []
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

    // Create lead in Zoho CRM via API
    console.log('About to create Zoho lead...')
    try {
      const zohoResponse = await fetch('/api/create-zoho-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData: formData, tipoLead: 'vendedor' })
      });
      const zohoResult = await zohoResponse.json();
      if (zohoResponse.ok) {
        console.log('Zoho lead created successfully:', zohoResult);
      } else {
        console.error('Error creating Zoho lead:', zohoResult);
      }
    } catch (zohoError) {
      console.error('Error calling Zoho API:', zohoError);
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