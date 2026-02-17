import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.APP_URL || 'http://localhost:5001';

console.log('🔧 Email Service Initialized');
console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not Set');
console.log('   APP_URL:', APP_URL);

export async function sendVerificationEmail(email: string, token: string, role: string = 'user'): Promise<void> {
  console.log(`\n📧 sendVerificationEmail called for: ${email} (${role})`);
  // const verificationLink is already declared above
  const verificationLink = `${APP_URL}/${role === 'business' ? 'business' : 'user'}/verify-email?token=${token}`;

  // ALWAYS Log in development, even if Resend is configured
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n===========================================');
    console.log('📧 EMAIL VERIFICATION (Development Mode)');
    console.log(`To: ${email}`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log('===========================================\n');
  }

  if (!resend) {
    return;
  }

  console.log('   Using Resend API to send email...');

  try {
    const result = await resend.emails.send({
      from: 'Trendle <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your Trendle account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Welcome to Trendle!</h1>
          <p>Thanks for signing up. Please verify your email address to get started.</p>
          <a href="${verificationLink}" 
             style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Verify Email Address
          </a>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${verificationLink}">${verificationLink}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `
    });

    console.log(`✅ Verification email sent successfully!`);
    console.log(`   Email ID: ${result.data?.id || 'N/A'}`);
  } catch (error: any) {
    console.error('❌ Failed to send verification email');
    console.error('   Error:', error.message || error);
    console.error('   Full error:', JSON.stringify(error, null, 2));
    // In production, you might want to throw this error or handle it differently
    // For now, we'll log it but not fail the signup process
  }
}
