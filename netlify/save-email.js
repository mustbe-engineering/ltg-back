const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, recaptchaToken } = JSON.parse(event.body);

  // 1. Verify reCAPTCHA
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
  const response = await fetch(verifyUrl, { method: 'POST' });
  const recaptchaResult = await response.json();

  if (!recaptchaResult.success) {
    return { statusCode: 400, body: JSON.stringify({ message: "reCAPTCHA verification failed" }) };
  }

  // 2. Save to Google Sheets
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Assuming the first tab
    await sheet.addRow({ Email: email, Date: new Date().toISOString() });

    return { statusCode: 200, body: JSON.stringify({ message: "Email saved!" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};