const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://ladiesthegathering.com',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle the browser's pre-flight check
  if (event.httpMethod === "OPTIONS") {
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: "OK" }) 
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ message: "Method Not Allowed" }) 
    };
  }

  try {
    const { email, recaptchaToken } = JSON.parse(event.body);

    // 1. Verify reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const recResponse = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaResult = await recResponse.json();

    if (!recaptchaResult.success) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ message: "reCAPTCHA fallido" }) 
      };
    }

    // 2. Auth with Google
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    // Make sure your Google Sheet headers match these keys!
    await sheet.addRow({ 
      Email: email, 
      Date: new Date().toLocaleString("es-MX", { timeZone: "America/Tijuana" }) 
    });

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: "¡Suscripción exitosa!" }) 
    };
  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ message: "Error interno", error: error.message }) 
    };
  }
};