const axios = require('axios');

console.log("🔐 CRÉATION ADMIN POUR UPLOAD - Version Corrigée");
console.log("================================================");

async function createUniqueAdmin() {
    const baseURL = 'http://localhost:4000/api';
    
    // Données admin uniques
    const timestamp = Date.now();
    const adminData = {
        firstname: "Admin",
        lastname: "Upload", 
        email: `admin.upload.${timestamp}@test.com`,
        mobile: `99${timestamp.toString().slice(-8)}`, // Mobile unique
        password: "upload123"
    };
    
    console.log("1. 🧪 Création admin unique...");
    console.log(`   📧 Email: ${adminData.email}`);
    console.log(`   📱 Mobile: ${adminData.mobile}`);
    
    try {
        // Créer l'admin
        const createResponse = await axios.post(`${baseURL}/user/register`, adminData);
        console.log("   ✅ Utilisateur créé");
        
        // Récupérer tous les utilisateurs pour trouver le nôtre
        const usersResponse = await axios.get(`${baseURL}/user/all-users`);
        const ourUser = usersResponse.data.data.find(user => user.email === adminData.email);
        
        if (ourUser) {
            // Promouvoir en admin
            await axios.put(`${baseURL}/user/edit-user/${ourUser._id}`, {
                role: "admin"
            });
            console.log("   ✅ Promu en admin");
        }
        
        // Test connexion
        console.log("\n2. 🔑 Test connexion...");
        const loginResponse = await axios.post(`${baseURL}/user/admin-login`, {
            email: adminData.email,
            password: adminData.password
        });
        
        console.log("   ✅ Connexion admin réussie");
        const token = loginResponse.data.token;
        console.log("   🎫 Token généré:", token?.substring(0, 30) + "...");
        
        // Test upload avec ce token
        console.log("\n3. 🖼️  Test upload authentifié...");
        
        const FormData = require('form-data');
        const fs = require('fs');
        const path = require('path');
        
        // Créer une vraie image de test (1x1 pixel PNG)
        const pngData = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
            0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x5C, 0xC2, 0xFB, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        const testImagePath = path.join(__dirname, 'test-upload.png');
        fs.writeFileSync(testImagePath, pngData);
        
        const formData = new FormData();
        formData.append('images', fs.createReadStream(testImagePath), 'test-upload.png');
        
        const uploadResponse = await axios.post(`${baseURL}/upload/`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${token}`
            },
            timeout: 15000
        });
        
        console.log("   ✅ Upload test réussi!");
        console.log("   📊 Réponse:", uploadResponse.data);
        
        // Nettoyer
        fs.unlinkSync(testImagePath);
        
        console.log("\n🎉 PROBLÈME RÉSOLU!");
        console.log("===================");
        console.log("📋 Pour utiliser l'upload:");
        console.log(`   1. Allez sur: http://localhost:3001`);
        console.log(`   2. Connectez-vous avec:`);
        console.log(`      📧 Email: ${adminData.email}`);
        console.log(`      🔐 Password: ${adminData.password}`);
        console.log(`   3. Allez dans 'Ajouter Produit'`);
        console.log(`   4. Uploadez vos images (max 10MB)`);
        
    } catch (error) {
        console.log("   ❌ Erreur:", error.response?.data?.message || error.message);
        
        if (error.response?.status === 400 && error.response?.data?.message?.includes("Already Exists")) {
            console.log("\n   💡 Essayons avec un admin existant...");
            await tryExistingAdmin();
        }
    }
}

async function tryExistingAdmin() {
    const baseURL = 'http://localhost:4000/api';
    
    // Essayer avec des admins potentiellement existants
    const possibleAdmins = [
        { email: "admin@gmail.com", password: "admin123" },
        { email: "souad@test.com", password: "123456789" },
        { email: "admin@test.com", password: "admin123" },
        { email: "admin@admin.com", password: "admin" }
    ];
    
    for (const admin of possibleAdmins) {
        try {
            console.log(`   🔑 Test: ${admin.email}`);
            const loginResponse = await axios.post(`${baseURL}/user/admin-login`, admin);
            
            console.log(`   ✅ Connexion réussie avec: ${admin.email}`);
            console.log(`   🔐 Mot de passe: ${admin.password}`);
            console.log("\n   📋 Utilisez ces identifiants pour vous connecter!");
            return;
            
        } catch (error) {
            console.log(`   ❌ ${admin.email}: ${error.response?.data?.message || 'Échec'}`);
        }
    }
    
    console.log("\n   ⚠️  Aucun admin trouvé. Utilisez le script create-admin.js");
}

createUniqueAdmin().catch(console.error);
