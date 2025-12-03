// Test Zoho CRM integration
require('dotenv').config();

const { createLeadInZoho } = require('./src/lib/zohoService');

async function testZoho() {
  console.log('Testing Zoho CRM integration...');

  // Test data
  const testLead = {
    nombre: 'Test User',
    email: 'test@example.com',
    telefono: '555-123-4567',
    hectareas: 2.5,
    ubicacion_texto: 'Zamora, Michoacán',
    motivo_venta: 'Necesito liquidez'
  };

  try {
    console.log('Creating lead...');
    const result = await createLeadInZoho(testLead, 'vendedor');
    if (result) {
      console.log('✅ Zoho lead created successfully:', result);
    } else {
      console.log('❌ Failed to create Zoho lead');
    }
  } catch (error) {
    console.error('❌ Error testing Zoho:', error);
  }
}

testZoho();