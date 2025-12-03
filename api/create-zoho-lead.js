// API route to create Zoho CRM leads server-side
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';

// Get access token from refresh token
async function getZohoAccessToken() {
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    console.warn('Zoho credentials not configured');
    return null;
  }

  try {
    const response = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error getting Zoho access token:', data);
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error('Error calling Zoho token API:', error);
    return null;
  }
}

// Create lead in Zoho CRM
async function createZohoLead(accessToken, leadData, tipoLead) {
  if (!accessToken) {
    console.warn('No access token for Zoho');
    return null;
  }

  // Build description from lead data
  let description = `Tipo: ${tipoLead === "vendedor" ? "Vendedor" : "Comprador"}\n`;
  description += `Nombre: ${leadData.nombre || leadData.contact_name}\n`;
  description += `Email: ${leadData.email || leadData.contact_email}\n`;
  description += `Teléfono: ${leadData.telefono || leadData.contact_phone}\n`;

  if (tipoLead === "vendedor") {
    description += `Hectáreas: ${leadData.hectareas || leadData.hectares}\n`;
    description += `Ubicación: ${leadData.ubicacion_texto || leadData.location}\n`;
    description += `Motivo de venta: ${leadData.motivo_venta || leadData.reason_for_sale}\n`;
    if (leadData.expectativa_precio) {
      description += `Precio esperado: $${leadData.expectativa_precio}\n`;
    }
  } else {
    description += `Hectáreas necesarias: ${leadData.hectareas || leadData.hectares_needed}\n`;
    description += `Zona: ${leadData.zona || leadData.location}\n`;
    description += `Tipo de túnel: ${leadData.tipo || leadData.tunnel_type}\n`;
    if (leadData.presupuesto) {
      description += `Presupuesto: $${leadData.presupuesto}\n`;
    }
  }

  const zohoLead = {
    data: [{
      Last_Name: leadData.nombre || leadData.contact_name || 'Lead',
      Email: leadData.email || leadData.contact_email,
      Phone: leadData.telefono || leadData.contact_phone,
      Lead_Source: "Web - TunelUSA2",
      Lead_Status: "Nuevo",
      Company: tipoLead === "vendedor" ? "Vendedor" : "Comprador",
      Description: description
    }]
  };

  try {
    const response = await fetch(`${ZOHO_API_DOMAIN}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zohoLead)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error creating Zoho lead:', result);
      return null;
    }

    console.log('Zoho lead created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error calling Zoho CRM API:', error);
    return null;
  }
}

// Main function to create lead (handles token refresh)
async function createLeadInZoho(leadData, tipoLead) {
  try {
    const accessToken = await getZohoAccessToken();
    if (!accessToken) {
      console.warn('Could not get Zoho access token');
      return null;
    }

    return await createZohoLead(accessToken, leadData, tipoLead);
  } catch (error) {
    console.error('Error in createLeadInZoho:', error);
    return null;
  }
}

export default async function handler(req, res) {
  console.log('API called: create-zoho-lead');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leadData, tipoLead } = req.body;

    if (!leadData || !tipoLead) {
      console.log('Missing data:', { leadData: !!leadData, tipoLead: !!tipoLead });
      return res.status(400).json({ error: 'Missing leadData or tipoLead' });
    }

    console.log('Creating Zoho lead server-side for:', tipoLead, 'with data:', leadData);
    const result = await createLeadInZoho(leadData, tipoLead);

    if (result) {
      console.log('Zoho lead created successfully server-side:', result);
      res.status(200).json({ success: true, result });
    } else {
      console.log('Failed to create Zoho lead server-side');
      res.status(500).json({ error: 'Failed to create lead' });
    }
  } catch (error) {
    console.error('Error in create-zoho-lead API:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}