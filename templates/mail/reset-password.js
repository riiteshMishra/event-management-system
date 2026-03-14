require("dotenv").config();

const resetPasswordTemplate = (name, token) => {

  const domain = process.env.DOMAIN;
  const resetUrl = `${domain}/reset-password/${token}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <title>Password Reset</title>

    <style>

      body{
        font-family: Arial, sans-serif;
        background:#f4f6f8;
        padding:40px;
      }

      .container{
        max-width:600px;
        margin:auto;
        background:white;
        padding:30px;
        border-radius:8px;
        box-shadow:0 5px 15px rgba(0,0,0,0.08);
      }

      .header{
        font-size:22px;
        font-weight:bold;
        margin-bottom:20px;
        color:#111;
      }

      .text{
        color:#444;
        line-height:1.6;
        font-size:15px;
      }

      .button{
        display:inline-block;
        padding:14px 25px;
        background:#111;
        color:white;
        text-decoration:none;
        border-radius:6px;
        margin-top:20px;
        font-weight:bold;
      }

      .warning{
        margin-top:25px;
        padding:15px;
        background:#fff4f4;
        border-left:4px solid #ff4d4f;
        color:#b00020;
      }

      .footer{
        margin-top:30px;
        font-size:13px;
        color:#777;
      }

    </style>

  </head>

  <body>

  <div class="container">

    <div class="header">
      पासवर्ड रीसेट करने का अनुरोध
    </div>

    <p class="text">
      नमस्ते ${name},
    </p>

    <p class="text">
      हमें आपके खाते का पासवर्ड रीसेट करने का अनुरोध प्राप्त हुआ है।
      नया पासवर्ड सेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।
    </p>

    <a href="${resetUrl}" class="button">
      पासवर्ड रीसेट करें
    </a>

    <div class="warning">
      यदि आपने पासवर्ड रीसेट करने का अनुरोध नहीं किया है,
      तो इस ईमेल को अनदेखा करें। आपका खाता अभी भी सुरक्षित है।
    </div>

    <p class="footer">
      सुरक्षा कारणों से यह लिंक 5 मिनट में समाप्त हो जाएगा।
      <br/><br/>
      © ${new Date().getFullYear()} ${domain}
    </p>

  </div>

  </body>
  </html>
  `;
};

module.exports = resetPasswordTemplate;