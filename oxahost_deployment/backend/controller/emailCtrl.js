const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

// Configuration du transporteur SMTP
const sendEmail = asyncHandler(async (data, req, res) => {
    try {
        let transporter;
        
        // Si SMTP_PASS n'est pas configuré, utiliser le mode test
        if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'YOUR_BREVO_SMTP_KEY_HERE') {
            console.log('⚠️ Mode test : SMTP_PASS non configuré, utilisation d\'Ethereal Email');
            
            // Créer un compte test avec Ethereal Email
            let testAccount = await nodemailer.createTestAccount();
            
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } else {
            // Configuration production avec Brevo
            console.log('📧 Mode production : utilisation de Brevo SMTP');
            
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false,
                auth: {
                    user: 'abassiabir060@gmail.com',
                    pass: process.env.SMTP_PASS,
                },
            });
        }

        // Envoyer l'email
        let info = await transporter.sendMail({
            from: `"Sanny Shop 👋" <${process.env.EMAIL_FROM || 'sannyshop@gmail.com'}>`,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.htm,
        });

        console.log("✅ Message envoyé avec succès, ID:", info.messageId);
        
        // Si en mode test, afficher l'URL de prévisualisation
        if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'YOUR_BREVO_SMTP_KEY_HERE') {
            console.log("🔗 URL de prévisualisation:", nodemailer.getTestMessageUrl(info));
        }
        
        return info;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        throw new Error(`Erreur email: ${error.message}`);
    }
});

module.exports = sendEmail;
