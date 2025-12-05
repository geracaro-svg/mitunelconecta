// Test Zoho CRM integration locally
require('dotenv').config();

async function testZohoLocally() {
  console.log('Testing Zoho CRM integration locally...');

  // Simulate the API logic
  const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
  const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
  const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
  const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
  const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';

  console.log('Zoho Client ID:', ZOHO_CLIENT_ID ? 'Set' : 'Not set');
  console.log('Zoho Client Secret:', ZOHO_CLIENT_SECRET ? 'Set' : 'Not set');
  console.log('Zoho Refresh Token:', ZOHO_REFRESH_TOKEN ? 'Set' : 'Not set');

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    console.error('Zoho credentials not configured in .env');
    return;
  }

  // Get access token
  try {
    console.log('Getting access token...');
    const tokenResponse = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Error getting access token:', tokenData);
      return;
    }

    console.log('Access token obtained successfully');

    // Test data
    const testLead = {
      nombre: 'Test User Local',
      email: 'testlocal@example.com',
      telefono: '555-123-4567',
      hectareas: 2.5,
      ubicacion_texto: 'Zamora, Michoacán',
      motivo_venta: 'Prueba local'
    };

    // Build description
    let description = `Tipo: Vendedor\n`;
    description += `Nombre: ${testLead.nombre}\n`;
    description += `Email: ${testLead.email}\n`;
    description += `Teléfono: ${testLead.telefono}\n`;
    description += `Hectáreas: ${testLead.hectareas}\n`;
    description += `Ubicación: ${testLead.ubicacion_texto}\n`;
    description += `Motivo de venta: ${testLead.motivo_venta}\n`;

    const zohoLead = {
      data: [{
        Last_Name: testLead.nombre,
        Email: testLead.email,
        Phone: testLead.telefono,
        Lead_Source: "Web - TunelUSA2",
        Lead_Status: "Nuevo",
        Company: "Vendedor",
        Description: description
      }]
    };

    console.log('Creating lead...');
    const leadResponse = await fetch(`${ZOHO_API_DOMAIN}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zohoLead)
    });

    const leadResult = await leadResponse.json();

    if (leadResponse.ok) {
      console.log('✅ Zoho lead created successfully locally:', leadResult);
    } else {
      console.error('❌ Error creating Zoho lead:', leadResult);
    }

  } catch (error) {
    console.error('❌ Error in local test:', error);
  }
}

testZohoLocally();