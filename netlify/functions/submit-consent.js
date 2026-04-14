const sgMail = require('@sendgrid/mail');

const COUNSELOR_EMAIL = 'justin@loveinmost.org';

const SECTIONS_KO = [
  { num: '1', title: '상담의 목적 및 과정 안내', body: '본 상담은 개인의 심리적, 정서적, 관계적 어려움을 이해하고 회복하기 위해 상담자와 내담자가 함께 참여하는 협력적인 과정입니다. 상담자는 내담자의 이야기를 비판 없이 경청하며, 통찰과 변화를 돕습니다.' },
  { num: '2', title: '상담자의 자격 및 상담 접근 방식', body: '상담자는 호주와 대한민국의 공인 자격을 보유한 전문 상담자로서, 통합적 접근(심리학적, 관계중심, 영성적 통찰 포함)을 통해 내담자에게 적절한 방법으로 상담을 제공합니다. 필요시 슈퍼비전(전문가 감독)과 협의를 거쳐 상담의 질을 유지합니다.' },
  { num: '3', title: '기대 효과와 한계', body: '상담을 통해 자기 이해, 감정 조절, 관계 회복 등의 긍정적인 변화를 경험할 수 있습니다. 그러나 상담 효과는 개인마다 차이가 있으며, 구체적인 결과를 보장할 수는 없습니다.' },
  { num: '4', title: '상담 중 발생할 수 있는 정서적 반응', body: '상담 과정에서 과거의 기억이나 감정이 떠오르며 일시적인 불편감이나 슬픔, 분노, 불안 등이 생길 수 있습니다. 이는 자연스러운 치료적 반응이며, 상담자는 이러한 감정을 안전하게 다룰 수 있도록 돕습니다.' },
  { num: '5', title: '비밀보장 및 예외 조항', body: '상담 내용은 엄격하게 비밀로 유지되며, 내담자의 동의 없이 외부에 공개되지 않습니다. 단, 다음과 같은 경우에는 예외적으로 관련 기관에 알릴 의무가 있습니다: 자살 또는 타해의 위험이 명백할 경우 / 아동, 노인, 장애인 학대가 의심될 경우 / 법원의 명령이나 법적 요청이 있을 경우' },
  { num: '6', title: '개인정보 및 기록 관리', body: '상담 중 수집된 개인정보 및 상담 기록은 안전하게 보관되며, 호주 법에 따라 최소 7년간 보존된 후 폐기됩니다. 내담자는 본인의 기록 열람을 요청할 수 있으나, 일부 제한이 있을 수 있습니다.' },
  { num: '7', title: '상담 녹음 동의', body: '상담자는 더 높고 효율적인 상담 제공을 위해 상담 내용을 녹음할 수 있습니다. 녹음된 자료는 외부에 유출되지 않으며, 철저히 보안 관리되고, 상담 종료 후 즉시 안전하게 폐기됩니다.' },
  { num: '8', title: '상담 비용 및 결제, 취소 규정', body: '상담 비용은 상담 유형에 따라 사전 안내되며, 모든 금액에 GST(10%)가 별도 부과됩니다. 결제는 상담 당일 이전 또는 직후 카드, 계좌이체로 가능합니다. 예약된 시간 24시간 이내 취소 또는 불참 시 일정 수수료가 발생할 수 있습니다.' },
  { num: '9', title: '위기 상황 시 대응 방침', body: '상담은 비응급 상황을 위한 심리적 지원입니다. 생명에 위협이 있는 위급 상황에서는 즉시 000(응급 구조), Lifeline(13 11 14) 등의 기관에 연락하시기 바랍니다.' },
  { num: '10', title: '상담자의 슈퍼비전 및 전문가 협의', body: '상담자는 정기적으로 슈퍼비전(전문가 감독)을 통해 상담의 윤리성과 전문성을 유지합니다. 이 과정에서 내담자의 신상정보는 비식별화되어 사용되며, 개인 정보는 외부에 유출되지 않습니다.' },
  { num: '11', title: '동의 철회 및 상담 종료', body: '내담자는 상담 과정 중 언제든지 상담을 중단하거나 철회할 수 있습니다. 상담자는 상담 종료 또는 중단 결정에 대해 존중하며, 필요시 적절한 대안을 안내할 수 있습니다.' },
];

const SECTIONS_EN = [
  { num: '1', title: 'Purpose and Process of Counselling', body: 'This counselling process is a collaborative journey between the counsellor and the client, aimed at understanding and restoring psychological, emotional, and relational well-being. The counsellor will listen without judgment and support the client in gaining insight and making positive changes.' },
  { num: '2', title: 'Counsellor Qualifications and Approach', body: 'The counsellor is a qualified professional, accredited under both Australian and Korean national standards. An integrative approach is used, incorporating psychological, relational, and spiritual insights as appropriate for the client. Quality of counselling is maintained through regular supervision and professional consultation when necessary.' },
  { num: '3', title: 'Expected Benefits and Limitations', body: 'Counselling may help with self-understanding, emotional regulation, and relationship restoration. However, results vary between individuals, and specific outcomes cannot be guaranteed.' },
  { num: '4', title: 'Emotional Reactions During Counselling', body: 'During sessions, past memories or emotions may surface, which can temporarily cause discomfort, sadness, anger, or anxiety. These are natural therapeutic responses, and the counsellor will guide the client in processing these emotions safely.' },
  { num: '5', title: 'Confidentiality and Its Exceptions', body: 'All counselling sessions are strictly confidential and will not be shared with third parties without the client\'s consent. However, the counsellor is legally and ethically obligated to report to relevant authorities in the following cases: Clear risk of self-harm or harm to others / Suspected abuse of children, elderly individuals, or people with disabilities / Court orders or other legal requirements.' },
  { num: '6', title: 'Personal Information and Record Management', body: 'Personal information and counselling records are securely stored and will be retained for a minimum of seven (7) years in accordance with Australian law before safe disposal. Clients may request to access their records, though some restrictions may apply.' },
  { num: '7', title: 'Consent for Session Recording', body: 'For the purpose of improving counselling quality, sessions may be recorded with the client\'s consent. Recordings are kept strictly confidential, securely stored, and will be safely deleted after counselling ends.' },
  { num: '8', title: 'Fees, Payment, and Cancellation Policy', body: 'Counselling fees vary by session type and will be provided in advance. All fees are subject to 10% GST. Payments can be made before or immediately after the session via card or bank transfer. Cancellations made within 24 hours of the scheduled session or failure to attend may incur a fee.' },
  { num: '9', title: 'Crisis and Emergency Policy', body: 'Counselling services are for non-emergency support. If there is any threat to life or an urgent crisis, please contact 000 (Emergency) or Lifeline (13 11 14) immediately.' },
  { num: '10', title: 'Counsellor Supervision and Professional Consultation', body: 'The counsellor regularly engages in professional supervision to maintain ethical and professional standards. Any client information used in supervision is de-identified, and personal information is never disclosed externally.' },
  { num: '11', title: 'Withdrawal of Consent and Termination of Counselling', body: 'Clients have the right to withdraw from counselling or terminate sessions at any time. The counsellor will respect the client\'s decision and may provide appropriate referrals if needed.' },
];

function buildSectionsHtml(sections) {
  return sections.map(s => `
    <tr>
      <td colspan="2" style="padding:12px 8px 4px; border:1px solid #e2ddd8; background:#f0f7f4;">
        <strong style="color:#2a4d68;">${s.num}. ${s.title}</strong>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:8px; border:1px solid #e2ddd8; font-size:13px; line-height:1.7; color:#2c2c2c;">
        ${s.body}
      </td>
    </tr>
  `).join('');
}

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

  const sigBase64 = signature ? signature.replace(/^data:image\/png;base64,/, '') : null;
  const sections = isKo ? SECTIONS_KO : SECTIONS_EN;
  const sectionsHtml = buildSectionsHtml(sections);

  const htmlBody = isKo ? `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2a4d68; margin-bottom: 4px;">상담 치료 동의서 제출</h2>
      <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">아래 내용을 읽고 서명하여 제출되었습니다.</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2; width:140px;">내담자 이름</td><td style="padding:8px; border:1px solid #e2ddd8;">${name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">동의 날짜</td><td style="padding:8px; border:1px solid #e2ddd8;">${consent_date}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">양식</td><td style="padding:8px; border:1px solid #e2ddd8;">한국어</td></tr>
      </table>

      <h3 style="color:#2a4d68; border-bottom:2px solid #7db8a4; padding-bottom:6px; margin-bottom:0;">동의서 본문</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${sectionsHtml}
      </table>

      ${sigBase64 ? `
      <h3 style="color:#2a4d68; border-bottom:2px solid #7db8a4; padding-bottom:6px;">내담자 서명</h3>
      <div style="margin-bottom:24px;">
        <img src="cid:signature" style="border:1px solid #e2ddd8; border-radius:8px; max-width:100%;"/>
      </div>` : ''}

      <p style="font-size:12px; color:#6b7280; border-top:1px solid #e2ddd8; padding-top:12px;">Love Inmost — Life Coaching &amp; Counselling</p>
    </div>
  ` : `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2a4d68; margin-bottom: 4px;">Counselling Consent Form Submitted</h2>
      <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">The client has read and signed the consent form below.</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2; width:140px;">Client Name</td><td style="padding:8px; border:1px solid #e2ddd8;">${name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">Consent Date</td><td style="padding:8px; border:1px solid #e2ddd8;">${consent_date}</td></tr>
        <tr><td style="padding:8px; border:1px solid #e2ddd8; font-weight:600; background:#f7f5f2;">Form</td><td style="padding:8px; border:1px solid #e2ddd8;">English</td></tr>
      </table>

      <h3 style="color:#2a4d68; border-bottom:2px solid #7db8a4; padding-bottom:6px; margin-bottom:0;">Consent Form Content</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        ${sectionsHtml}
      </table>

      ${sigBase64 ? `
      <h3 style="color:#2a4d68; border-bottom:2px solid #7db8a4; padding-bottom:6px;">Client Signature</h3>
      <div style="margin-bottom:24px;">
        <img src="cid:signature" style="border:1px solid #e2ddd8; border-radius:8px; max-width:100%;"/>
      </div>` : ''}

      <p style="font-size:12px; color:#6b7280; border-top:1px solid #e2ddd8; padding-top:12px;">Love Inmost — Life Coaching &amp; Counselling</p>
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
