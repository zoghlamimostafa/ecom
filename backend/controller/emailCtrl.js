const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

// Configuration du transporteur SMTP
const sendEmail = asyncHandler(async (data, req, res) => {
    try {
        // Configuration simple avec Gmail
        console.log('📧 Utilisation de Gmail pour l\'envoi d\'emails');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sannyshop@gmail.com', // Remplacez par votre email
                pass: process.env.GMAIL_APP_PASSWORD || 'votre_mot_de_passe_app_gmail'
            }
        });

        // Envoyer l'email
        let info = await transporter.sendMail({
            from: `"Sanny Store 🛍️" <sannyshop@gmail.com>`,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.htm,
        });

        console.log("✅ Email envoyé avec succès à:", data.to);
        console.log("📧 Message ID:", info.messageId);
        
        return info;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        
        // En cas d'échec, créer un lien de prévisualisation test
        console.log('⚠️ Échec de l\'envoi, création d\'un email de test...');
        
        try {
            let testAccount = await nodemailer.createTestAccount();
            
            let testTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            
            let testInfo = await testTransporter.sendMail({
                from: `"Sanny Store �️" <test@sanny.com>`,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.htm,
            });
            
            console.log("🔗 URL de prévisualisation test:", nodemailer.getTestMessageUrl(testInfo));
            return testInfo;
            
        } catch (testError) {
            throw new Error(`Erreur email: ${error.message}`);
        }
    }
});

module.exports = sendEmail;
