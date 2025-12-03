// API route to create Zoho CRM leads server-side
const { createLeadInZoho } = require('../src/lib/zohoService');

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