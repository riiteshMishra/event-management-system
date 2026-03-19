const otpSendTemplate = (otp, email) => {

return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body{
    margin:0;
    padding:0;
    font-family:Arial, Helvetica, sans-serif;
    background:#f4f6fb;
}

.container{
    max-width:500px;
    margin:40px auto;
    background:white;
    border-radius:10px;
    overflow:hidden;
    text-align:center;
    box-shadow:0 5px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

/* hero */

.hero{
    background-image:url('https://res.cloudinary.com/dwpplwqzs/image/upload/v1771915285/Portfolio-site/iurxtcpymosl3vpl4txa.jpg');
    background-size:cover;
    background-position:center;
    padding:60px 20px;
    color:white;
}

.hero h1{
    margin:0;
    font-size:24px;
    background:rgba(0,0,0,0.45);
    display:inline-block;
    padding:10px 20px;
    border-radius:6px;
}

/* content */

.content{
    padding:30px;
}

.title{
    font-size:22px;
    font-weight:bold;
    margin-bottom:20px;
    color:#333;
}

.text{
    color:#555;
    margin-bottom:20px;
}

.otp{
    font-size:28px;
    font-weight:bold;
    letter-spacing:6px;
    color:#4f46e5;
    background:#eef2ff;
    padding:12px 20px;
    display:inline-block;
    border-radius:8px;
    margin:20px 0;
}

.footer{
    font-size:12px;
    color:#888;
    margin-top:20px;
}

</style>
</head>

<body>

<div class="container">

<!-- HERO SECTION -->

<div class="hero">
<h1>ग्राम सभा बलुआ में आपका स्वागत है</h1>
</div>

<!-- CONTENT -->

<div class="content">

<div class="title">ओटीपी सत्यापन</div>

<div class="text">
नमस्ते ${email},<br><br>
अपना ईमेल सत्यापित करने के लिए नीचे दिया गया ओटीपी उपयोग करें।
</div>

<div class="otp">
${otp}
</div>

<div class="text">
यह ओटीपी 5 मिनट के अंदर समाप्त हो जाएगा।
</div>

<div class="footer">
यदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा करें।
</div>

</div>

</div>

</body>
</html>
`
}

module.exports = otpSendTemplate