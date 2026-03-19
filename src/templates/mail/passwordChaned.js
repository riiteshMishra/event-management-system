require("dotenv").config()

const passwordChangedTemplate = (name) => {

    const domain = process.env.DOMAIN;

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
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
        color:#111;
        margin-bottom:15px;
      }

      .text{
        color:#444;
        line-height:1.6;
        font-size:15px;
      }

      .warning{
        background:#fff4f4;
        border-left:4px solid #ff4d4f;
        padding:15px;
        margin:20px 0;
        color:#b00020;
      }

      .button{
        display:inline-block;
        padding:12px 22px;
        background:#111;
        color:white;
        text-decoration:none;
        border-radius:5px;
        margin-top:15px;
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
      यदि आपने स्वयं यह बदलाव किया है, तो इस ईमेल को अनदेखा कर सकते हैं।
    </p>

    <div class="warning">
      यदि आपने अपना पासवर्ड नहीं बदला है, तो संभव है कि किसी और ने आपके खाते तक पहुँच बना ली हो।  
      कृपया तुरंत अपना पासवर्ड बदलें।
    </div>

    <a href="${domain}/change-password" class="button">
      पासवर्ड बदलें
    </a>

    <p class="footer">
      यदि आपको किसी भी प्रकार की सहायता चाहिए तो हमारी सपोर्ट टीम से संपर्क करें।
      <br/><br/>
      © ${new Date().getFullYear()} ${domain}
    </p>

  </div>

  </body>
  </html>
  `;
};

module.exports = passwordChangedTemplate;