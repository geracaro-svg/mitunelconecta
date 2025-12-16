// Test script to send email using Resend API
// Run with: node test-email.js

const { Resend } = require('resend');

const resend = new Resend('re_iV8uuj2Y_K1KwL3jfrktJkLRsWua6SWLR');

async function testEmail() {
  try {
    console.log('Sending test email...');

    const { data, error } = await resend.emails.send({
      from: 'TunnelUSAdo <onboarding@resend.dev>',
      to: ['tunelusado@gmail.com'],
      subject: 'Test Email from TunnelUSAdo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Test Email - TunnelUSAdo</h1>

          <p>This is a test email to verify that the email system is working.</p>

          <p>If you receive this email, it means:</p>
          <ul>
            <li>✅ Resend API key is working</li>
            <li>✅ Email sending is functional</li>
            <li>✅ Domain configuration is correct</li>
          </ul>

          <p>Next step: Deploy the Supabase Edge Function for automatic emails.</p>

          <p style="color: #6b7280; font-size: 14px;">
            Test sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('Check geracaro@gmail.com for the test email.');

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testEmail();