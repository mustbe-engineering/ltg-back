exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://ladiesthegathering.com',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const { email, recaptchaToken } = JSON.parse(event.body);

    // 1. Verify reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const recResponse = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaResult = await recResponse.json();

    if (!recaptchaResult.success) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "reCAPTCHA error" }) };
    }

    // 2. Dynamic Import for ESM Module (The Fix for your log error)
    const { GoogleSpreadsheet } = await import('google-spreadsheet');
    const { JWT } = await import('google-auth-library');

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.addRow({ 
      Email: email, 
      Date: new Date().toISOString() 
    });

    return { statusCode: 200, headers, body: JSON.stringify({ message: "Success" }) };

  } catch (error) {
    console.error("Function Error:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};