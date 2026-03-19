require("dotenv").config();

const passwordResetSuccessTemplate = (name) => {

  const domain = process.env.DOMAIN;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <title>Password Changed</title>

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
      आपका पासवर्ड सफलतापूर्वक बदल दिया गया है
    </div>

    <p class="text">
      नमस्ते ${name},
    </p>

    <p class="text">
      आपके खाते का पासवर्ड सफलतापूर्वक बदल दिया गया है।
      अब आप अपने नए पासवर्ड का उपयोग करके लॉगिन कर सकते हैं।
    </p>

    <a href="${domain}/login" class="button">
      अभी लॉगिन करें
    </a>

    <div class="warning">
      यदि आपने यह पासवर्ड परिवर्तन नहीं किया है, तो तुरंत अपना पासवर्ड बदलें
      या हमारी सहायता टीम से संपर्क करें।
    </div>

    <p class="footer">
      धन्यवाद<br/>
      ${domain}
      <br/><br/>
      © ${new Date().getFullYear()} All Rights Reserved
    </p>

  </div>

  </body>
  </html>
  `;
};

module.exports = passwordResetSuccessTemplate;