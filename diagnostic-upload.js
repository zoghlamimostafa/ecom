const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

console.log('🔍 DIAGNOSTIC UPLOAD D\'IMAGES');
console.log('='.repeat(50));

// Test de l'endpoint d'upload
async function testUploadEndpoint() {
    console.log('\n📡 Test de l\'endpoint d\'upload...');
    
    try {
        // Test simple GET pour vérifier que l'endpoint existe
        const response = await axios.get('http://localhost:4000/api/upload/', {
            timeout: 5000
        });
        console.log('✅ Endpoint d\'upload accessible');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log('❌ Endpoint d\'upload introuvable (404)');
            } else if (error.response.status === 405) {
                console.log('✅ Endpoint existe mais GET non autorisé (normal)');
            } else {
                console.log(`⚠️ Endpoint répond avec status: ${error.response.status}`);
            }
        } else {
            console.log('❌ Impossible de joindre l\'endpoint d\'upload');
        }
    }
}

// Test de la route d'upload dans le backend
async function checkBackendRoutes() {
    console.log('\n📁 Vérification des routes backend...');
    
    const routeFiles = [
        'backend/routes/uploadRoute.js',
        'backend/index.js'
    ];
    
    for (const file of routeFiles) {
        const fullPath = `C:\\Users\\souad ben brahim\\Downloads\\san\\ecomerce_sanny\\${file}`;
        try {
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                console.log(`✅ ${file} existe`);
                
                // Vérifier les routes d'upload
                if (content.includes('/upload')) {
                    console.log(`  ✅ Contient des routes d'upload`);
                }
                if (content.includes('multer')) {
                    console.log(`  ✅ Utilise multer pour l'upload`);
                }
                if (content.includes('cloudinary')) {
                    console.log(`  ✅ Intégration Cloudinary détectée`);
                }
            } else {
                console.log(`❌ ${file} manquant`);
            }
        } catch (error) {
            console.log(`❌ Erreur lecture ${file}: ${error.message}`);
        }
    }
}

// Test de la configuration Cloudinary
async function checkCloudinaryConfig() {
    console.log('\n☁️ Vérification configuration Cloudinary...');
    
    try {
        const envPath = 'C:\\Users\\souad ben brahim\\Downloads\\san\\ecomerce_sanny\\backend\\.env';
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            
            const cloudinaryVars = [
                'CLOUD_NAME',
                'API_KEY', 
                'API_SECRET'
            ];
            
            cloudinaryVars.forEach(varName => {
                if (envContent.includes(varName)) {
                    console.log(`  ✅ ${varName} configuré`);
                } else {
                    console.log(`  ❌ ${varName} manquant`);
                }
            });
        } else {
            console.log('❌ Fichier .env manquant');
        }
    } catch (error) {
        console.log(`❌ Erreur vérification .env: ${error.message}`);
    }
}

// Test du dossier d'upload local
async function checkUploadDirectory() {
    console.log('\n📂 Vérification dossier d\'upload...');
    
    const uploadDirs = [
        'backend/public',
        'backend/public/images'
    ];
    
    for (const dir of uploadDirs) {
        const fullPath = `C:\\Users\\souad ben brahim\\Downloads\\san\\ecomerce_sanny\\${dir}`;
        try {
            if (fs.existsSync(fullPath)) {
                console.log(`✅ ${dir} existe`);
                
                // Vérifier les permissions
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    console.log(`  ✅ Est un dossier valide`);
                }
            } else {
                console.log(`❌ ${dir} manquant`);
                // Créer le dossier s'il n'existe pas
                try {
                    fs.mkdirSync(fullPath, { recursive: true });
                    console.log(`  ✅ Dossier créé: ${dir}`);
                } catch (createError) {
                    console.log(`  ❌ Impossible de créer ${dir}: ${createError.message}`);
                }
            }
        } catch (error) {
            console.log(`❌ Erreur vérification ${dir}: ${error.message}`);
        }
    }
}

// Analyser le code frontend d'upload
async function analyzeFrontendUpload() {
    console.log('\n💻 Analyse du code frontend d\'upload...');
    
    const files = [
        'admin-app/src/features/upload/uploadService.js',
        'admin-app/src/features/upload/uploadSlice.js',
        'admin-app/src/pages/Addproduct.js'
    ];
    
    for (const file of files) {
        const fullPath = `C:\\Users\\souad ben brahim\\Downloads\\san\\ecomerce_sanny\\${file}`;
        try {
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                console.log(`✅ ${file} existe`);
                
                // Analyser le contenu
                if (content.includes('FormData')) {
                    console.log(`  ✅ Utilise FormData`);
                }
                if (content.includes('multipart/form-data')) {
                    console.log(`  ✅ Content-Type correct configuré`);
                }
                if (content.includes('uploadImg')) {
                    console.log(`  ✅ Fonction uploadImg présente`);
                }
                if (content.includes('dispatch')) {
                    console.log(`  ✅ Intégration Redux`);
                }
                if (content.includes('toast')) {
                    console.log(`  ✅ Notifications toast`);
                }
            } else {
                console.log(`❌ ${file} manquant`);
            }
        } catch (error) {
            console.log(`❌ Erreur analyse ${file}: ${error.message}`);
        }
    }
}

// Problèmes communs et solutions
function displayCommonIssues() {
    console.log('\n🚨 PROBLÈMES COMMUNS ET SOLUTIONS:');
    console.log('='.repeat(50));
    
    const issues = [
        {
            problem: "L'image n'apparaît pas après upload",
            causes: [
                "Problème de CORS",
                "Cloudinary mal configuré", 
                "FormData incorrectement formé",
                "État Redux non mis à jour",
                "Erreur de réseau silencieuse"
            ],
            solutions: [
                "Vérifier les logs du backend",
                "Tester l'upload directement via Postman",
                "Vérifier la configuration Cloudinary",
                "Ajouter plus de logs dans uploadService",
                "Vérifier l'état Redux avec Redux DevTools"
            ]
        },
        {
            problem: "Message 'Upload en cours' qui ne se termine jamais",
            causes: [
                "Promise qui ne se résout pas",
                "Erreur non gérée dans uploadSlice",
                "Timeout de requête",
                "Problème de formatage FormData"
            ],
            solutions: [
                "Ajouter un timeout plus long",
                "Améliorer la gestion d'erreurs",
                "Vérifier que les fichiers sont valides",
                "Debugger le redux state"
            ]
        }
    ];
    
    issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. 🔥 ${issue.problem}`);
        console.log('   Causes possibles:');
        issue.causes.forEach(cause => console.log(`     • ${cause}`));
        console.log('   Solutions:');
        issue.solutions.forEach(solution => console.log(`     ✅ ${solution}`));
    });
}

// Fonction principale
async function runUploadDiagnostic() {
    await testUploadEndpoint();
    await checkBackendRoutes();
    await checkCloudinaryConfig();
    await checkUploadDirectory();
    await analyzeFrontendUpload();
    displayCommonIssues();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 DIAGNOSTIC UPLOAD TERMINÉ');
    console.log('💡 Vérifiez la console du navigateur pour plus d\'infos');
}

runUploadDiagnostic().catch(error => {
    console.log(`❌ Erreur diagnostic: ${error.message}`);
});
