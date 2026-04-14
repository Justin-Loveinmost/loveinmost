const sgMail = require('@sendgrid/mail');

const COUNSELOR_EMAIL = 'justin@loveinmost.org';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('SENDGRID_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Email service not configured' }) };
  }

  sgMail.setApiKey(apiKey);

  const { formName, name, consent_date, signature } = data;
  const isKo = formName === 'consent-ko';

  const subject = isKo
    ? `[동의서 제출] ${name} — ${consent_date}`
    : `[Consent Form Submitted] ${name} — ${consent_date}`;

  // Embed signature image as base64 attachment
  const sigBase64 = signature ? signature.replace(/^data:image\/png;base64,/, '') : null;

  const htmlBody = isKo ? `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2a4d68;">상담 치료 동의서 제출</h2>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2; width:140px;">내담자 이름</td><td style="padding:8px; border:1px solid #e2ddd8;">${name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">동의 날짜</td><td style="padding:8px; border:1px solid #e2ddd8;">${consent_date}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">양식</td><td style="padding:8px; border:1px solid #e2ddd8;">한국어</td></tr>
      </table>
      ${sigBase64 ? `<div style="margin-top:24px;"><p style="font-weight:600; color:#2a4d68; margin-bottom:8px;">서명:</p><img src="cid:signature" style="border:1px solid #e2ddd8; border-radius:8px; max-width:100%;"/></div>` : ''}
      <p style="margin-top:24px; font-size:13px; color:#6b7280;">Love Inmost — Life Coaching &amp; Counselling</p>
    </div>
  ` : `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2a4d68;">Counselling Consent Form Submitted</h2>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2; width:140px;">Client Name</td><td style="padding:8px; border:1px solid #e2ddd8;">${name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">Consent Date</td><td style="padding:8px; border:1px solid #e2ddd8;">${consent_date}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">Form</td><td style="padding:8px; border:1px solid #e2ddd8;">English</td></tr>
      </table>
      ${sigBase64 ? `<div style="margin-top:24px;"><p style="font-weight:600; color:#2a4d68; margin-bottom:8px;">Signature:</p><img src="cid:signature" style="border:1px solid #e2ddd8; border-radius:8px; max-width:100%;"/></div>` : ''}
      <p style="margin-top:24px; font-size:13px; color:#6b7280;">Love Inmost — Life Coaching &amp; Counselling</p>
    </div>
  `;

  const msg = {
    to: COUNSELOR_EMAIL,
    from: { email: COUNSELOR_EMAIL, name: 'Love Inmost Consent' },
    subject,
    html: htmlBody,
  };

  if (sigBase64) {
    msg.attachments = [{
      content: sigBase64,
      filename: 'signature.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'signature',
    }];
  }

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('SendGrid error:', JSON.stringify(err?.response?.body || err.message));
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Email send failed' }),
    };
  }
};
