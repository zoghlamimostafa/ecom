const axios = require('axios');

console.log("🔐 SOLUTION: Erreur d'authentification Upload");
console.log("============================================");

async function createTestAdmin() {
    const baseURL = 'http://localhost:4000/api';
    
    console.log("1. 🧪 Création d'un admin de test...");
    
    const adminData = {
        firstname: "Admin",
        lastname: "Test",
        email: "admin@test.com",
        mobile: "1234567890",
        password: "admin123"
    };
    
    try {
        // Créer l'utilisateur admin
        const createResponse = await axios.post(`${baseURL}/user/register`, adminData);
        console.log("   ✅ Admin créé:", createResponse.data.message);
        
        // Promouvoir en admin
        const userId = createResponse.data._id;
        if (userId) {
            const promoteResponse = await axios.put(`${baseURL}/user/edit-user/${userId}`, {
                role: "admin"
            });
            console.log("   ✅ Promu admin");
        }
        
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes("User Already Exists")) {
            console.log("   ✅ Admin déjà existant");
        } else {
            console.log("   ❌ Erreur création:", error.response?.data?.message || error.message);
        }
    }
    
    console.log("\n2. 🔑 Test de connexion admin...");
    
    try {
        const loginResponse = await axios.post(`${baseURL}/user/admin-login`, {
            email: "admin@test.com",
            password: "admin123"
        });
        
        console.log("   ✅ Connexion réussie");
        console.log("   🎫 Token:", loginResponse.data.token?.substring(0, 20) + "...");
        
        // Test upload avec ce token
        console.log("\n3. 🧪 Test upload avec token valide...");
        
        const FormData = require('form-data');
        const fs = require('fs');
        const path = require('path');
        
        // Créer un fichier de test
        const testFile = path.join(__dirname, 'test-image.txt');
        fs.writeFileSync(testFile, 'fake image content');
        
        const formData = new FormData();
        formData.append('images', fs.createReadStream(testFile));
        
        const uploadResponse = await axios.post(`${baseURL}/upload/`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${loginResponse.data.token}`
            }
        });
        
        console.log("   ✅ Upload réussi avec token valide");
        
        // Nettoyer
        fs.unlinkSync(testFile);
        
    } catch (error) {
        console.log("   ❌ Erreur:", error.response?.data?.message || error.message);
    }
    
    console.log("\n📋 INSTRUCTIONS POUR RÉSOUDRE LE PROBLÈME :");
    console.log("   1. Allez sur http://localhost:3001");
    console.log("   2. Connectez-vous avec:");
    console.log("      📧 Email: admin@test.com");
    console.log("      🔐 Password: admin123");
    console.log("   3. Allez dans Ajouter Produit");
    console.log("   4. Testez l'upload d'image");
    console.log("\n   ⚠️  Si ça ne marche toujours pas:");
    console.log("   - Ouvrez F12 > Application > Local Storage");
    console.log("   - Vérifiez qu'il y a un 'user' avec un token");
    console.log("   - Sinon, reconnectez-vous");
}

createTestAdmin().catch(console.error);
