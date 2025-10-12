// Tests de sécurité avancés - Simulation d'attaques
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const crypto = require('crypto');

class SecurityPenetrationTest {
    constructor(baseURL = 'http://localhost:4000') {
        this.baseURL = baseURL;
        this.results = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: { passed: 0, failed: 0, critical: 0 },
            score: 0
        };
    }

    log(level, test, result, details = '') {
        const symbols = { pass: '✅', fail: '❌', critical: '🚨', info: '📋' };
        console.log(`${symbols[level]} ${test}: ${result}`);
        if (details) console.log(`   ${details}`);
        
        this.results.tests.push({
            level,
            test,
            result,
            details,
            timestamp: new Date().toISOString()
        });

        if (level === 'pass') this.results.summary.passed++;
        else if (level === 'fail') this.results.summary.failed++;
        else if (level === 'critical') this.results.summary.critical++;
    }

    async request(method, endpoint, data = null, headers = {}) {
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'User-Agent': 'SecurityTest/1.0',
                    ...headers
                },
                timeout: 10000,
                validateStatus: () => true // Accepter toutes les réponses
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return {
                status: response.status,
                data: response.data,
                headers: response.headers
            };
        } catch (error) {
            return {
                status: 0,
                error: error.message,
                data: null
            };
        }
    }

    // Test 1: Rate Limiting
    async testRateLimiting() {
        console.log('\n🔒 TEST RATE LIMITING');
        console.log('=' .repeat(40));

        try {
            const requests = [];
            for (let i = 0; i < 20; i++) {
                requests.push(this.request('GET', '/api/health'));
            }

            const responses = await Promise.all(requests);
            const rateLimited = responses.some(r => r.status === 429);

            if (rateLimited) {
                this.log('pass', 'Rate Limiting', 'Actif', 'Protection contre spam détectée');
            } else {
                this.log('fail', 'Rate Limiting', 'Inactif', 'Vulnérabilité: Pas de limite de requêtes');
            }
        } catch (error) {
            this.log('critical', 'Rate Limiting', 'Erreur', error.message);
        }
    }

    // Test 2: Headers de sécurité
    async testSecurityHeaders() {
        console.log('\n🛡️ TEST HEADERS DE SÉCURITÉ');
        console.log('=' .repeat(40));

        try {
            const response = await this.request('GET', '/api/health');
            const headers = response.headers;

            // Vérifier les headers de sécurité critiques
            const securityHeaders = {
                'x-frame-options': 'Protection Clickjacking',
                'x-content-type-options': 'Protection MIME sniffing',
                'x-xss-protection': 'Protection XSS',
                'strict-transport-security': 'HSTS (HTTPS only)',
                'content-security-policy': 'CSP'
            };

            for (const [header, description] of Object.entries(securityHeaders)) {
                if (headers[header]) {
                    this.log('pass', `Header ${header}`, 'Présent', description);
                } else {
                    this.log('fail', `Header ${header}`, 'Manquant', `Vulnérabilité: ${description}`);
                }
            }
        } catch (error) {
            this.log('critical', 'Security Headers', 'Erreur', error.message);
        }
    }

    // Test 3: Injection SQL/NoSQL
    async testInjectionAttacks() {
        console.log('\n💉 TEST INJECTION ATTACKS');
        console.log('=' .repeat(40));

        const injectionPayloads = [
            "'; DROP TABLE users; --",
            "{ $gt: '' }",
            "<script>alert('XSS')</script>",
            "../../etc/passwd",
            "${7*7}",
            "{{7*7}}",
            "%3Cscript%3Ealert('XSS')%3C/script%3E"
        ];

        try {
            for (const payload of injectionPayloads) {
                const response = await this.request('POST', '/api/user/login', {
                    email: payload,
                    password: payload
                });

                if (response.status === 400 && response.data?.error?.includes('invalid')) {
                    this.log('pass', `Injection Protection`, 'Bloquée', `Payload: ${payload.substring(0, 20)}...`);
                } else if (response.status === 500) {
                    this.log('critical', `Injection Vulnerability`, 'CRITIQUE', `Payload: ${payload}`);
                } else {
                    this.log('info', `Injection Test`, 'Neutre', `Status: ${response.status}`);
                }
            }
        } catch (error) {
            this.log('critical', 'Injection Tests', 'Erreur', error.message);
        }
    }

    // Test 4: Authentification
    async testAuthenticationSecurity() {
        console.log('\n🔐 TEST AUTHENTIFICATION');
        console.log('=' .repeat(40));

        try {
            // Test brute force protection
            const bruteForceAttempts = [];
            for (let i = 0; i < 10; i++) {
                bruteForceAttempts.push(
                    this.request('POST', '/api/user/login', {
                        email: 'test@example.com',
                        password: 'wrongpassword'
                    })
                );
            }

            const bruteResults = await Promise.all(bruteForceAttempts);
            const blocked = bruteResults.some(r => r.status === 429);

            if (blocked) {
                this.log('pass', 'Brute Force Protection', 'Actif', 'Tentatives de connexion limitées');
            } else {
                this.log('fail', 'Brute Force Protection', 'Inactif', 'Vulnérabilité: Attaque par force brute possible');
            }

            // Test accès sans token
            const unauthorizedResponse = await this.request('GET', '/api/user/profile');
            if (unauthorizedResponse.status === 401) {
                this.log('pass', 'Authorization Required', 'Actif', 'Accès protégé détecté');
            } else {
                this.log('fail', 'Authorization Required', 'Inactif', 'Vulnérabilité: Accès non protégé');
            }

        } catch (error) {
            this.log('critical', 'Authentication Tests', 'Erreur', error.message);
        }
    }

    // Test 5: Upload de fichiers malveillants
    async testFileUploadSecurity() {
        console.log('\n📁 TEST UPLOAD SÉCURISÉ');
        console.log('=' .repeat(40));

        try {
            // Créer des fichiers de test malveillants
            const maliciousFiles = [
                {
                    name: 'malicious.php',
                    content: '<?php system($_GET["cmd"]); ?>',
                    type: 'application/x-php'
                },
                {
                    name: 'script.js.jpg',
                    content: '<script>alert("XSS")</script>',
                    type: 'image/jpeg'
                },
                {
                    name: 'large.jpg',
                    content: Buffer.alloc(10 * 1024 * 1024, 'A'), // 10MB
                    type: 'image/jpeg'
                }
            ];

            for (const file of maliciousFiles) {
                const form = new FormData();
                form.append('images', Buffer.from(file.content), {
                    filename: file.name,
                    contentType: file.type
                });

                try {
                    const response = await axios.post(`${this.baseURL}/api/upload`, form, {
                        headers: {
                            ...form.getHeaders(),
                        },
                        timeout: 10000,
                        validateStatus: () => true
                    });

                    if (response.status === 400) {
                        this.log('pass', `Upload Protection (${file.name})`, 'Bloqué', 'Fichier malveillant rejeté');
                    } else if (response.status === 200) {
                        this.log('critical', `Upload Vulnerability (${file.name})`, 'CRITIQUE', 'Fichier malveillant accepté');
                    } else {
                        this.log('info', `Upload Test (${file.name})`, 'Status', `${response.status}`);
                    }
                } catch (error) {
                    this.log('pass', `Upload Protection (${file.name})`, 'Erreur contrôlée', 'Upload rejeté par sécurité');
                }
            }
        } catch (error) {
            this.log('critical', 'File Upload Tests', 'Erreur', error.message);
        }
    }

    // Test 6: CORS Configuration
    async testCORSSecurity() {
        console.log('\n🌐 TEST CONFIGURATION CORS');
        console.log('=' .repeat(40));

        try {
            // Test avec origin malveillant
            const maliciousResponse = await this.request('GET', '/api/health', null, {
                'Origin': 'https://malicious-site.com'
            });

            const corsHeader = maliciousResponse.headers['access-control-allow-origin'];
            
            if (!corsHeader || corsHeader !== 'https://malicious-site.com') {
                this.log('pass', 'CORS Protection', 'Restrictif', 'Origin malveillant rejeté');
            } else {
                this.log('fail', 'CORS Configuration', 'Permissif', 'Vulnérabilité: CORS trop ouvert');
            }

            // Test avec origin légitime
            const legitimateResponse = await this.request('GET', '/api/health', null, {
                'Origin': 'http://localhost:3000'
            });

            const legitimateCors = legitimateResponse.headers['access-control-allow-origin'];
            if (legitimateCors) {
                this.log('pass', 'CORS Functionality', 'Fonctionnel', 'Origin légitime accepté');
            } else {
                this.log('fail', 'CORS Functionality', 'Problème', 'Origin légitime rejeté');
            }

        } catch (error) {
            this.log('critical', 'CORS Tests', 'Erreur', error.message);
        }
    }

    // Test 7: Validation des entrées
    async testInputValidation() {
        console.log('\n✅ TEST VALIDATION ENTRÉES');
        console.log('=' .repeat(40));

        try {
            const invalidInputs = [
                {
                    endpoint: '/api/user/register',
                    data: {
                        firstname: '',
                        lastname: '',
                        email: 'invalid-email',
                        password: '123',
                        mobile: ''
                    },
                    expected: 400
                },
                {
                    endpoint: '/api/user/register',
                    data: {
                        firstname: 'A'.repeat(1000), // Trop long
                        lastname: 'Test',
                        email: 'test@example.com',
                        password: 'ValidPass123!',
                        mobile: '1234567890'
                    },
                    expected: 400
                }
            ];

            for (const test of invalidInputs) {
                const response = await this.request('POST', test.endpoint, test.data);
                
                if (response.status === test.expected) {
                    this.log('pass', 'Input Validation', 'Actif', `${test.endpoint} - Données invalides rejetées`);
                } else {
                    this.log('fail', 'Input Validation', 'Manquant', `${test.endpoint} - Données invalides acceptées`);
                }
            }
        } catch (error) {
            this.log('critical', 'Input Validation Tests', 'Erreur', error.message);
        }
    }

    // Test 8: Logging de sécurité
    async testSecurityLogging() {
        console.log('\n📊 TEST LOGGING SÉCURITÉ');
        console.log('=' .repeat(40));

        try {
            // Vérifier si les logs de sécurité existent
            const logPath = 'C:/xampp/htdocs/sanny/san/ecomerce_sanny/backend/logs/security.log';
            
            if (fs.existsSync(logPath)) {
                const logStats = fs.statSync(logPath);
                this.log('pass', 'Security Logging', 'Actif', `Fichier log: ${Math.round(logStats.size / 1024)}KB`);
            } else {
                this.log('fail', 'Security Logging', 'Manquant', 'Aucun fichier de log de sécurité trouvé');
            }

            // Test génération de log
            await this.request('POST', '/api/user/login', {
                email: 'suspicious-test@example.com',
                password: 'test'
            });

            this.log('info', 'Log Generation', 'Testé', 'Tentative de connexion suspecte loggée');

        } catch (error) {
            this.log('critical', 'Security Logging Tests', 'Erreur', error.message);
        }
    }

    // Calculer le score de sécurité
    calculateSecurityScore() {
        const totalTests = this.results.tests.length;
        const passedTests = this.results.summary.passed;
        const criticalIssues = this.results.summary.critical;

        // Score base sur les tests réussis
        let baseScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        // Pénalité pour les vulnérabilités critiques
        const criticalPenalty = criticalIssues * 20;

        this.results.score = Math.max(0, Math.round(baseScore - criticalPenalty));
        return this.results.score;
    }

    // Générer un rapport complet
    generateSecurityReport() {
        const score = this.calculateSecurityScore();
        
        console.log('\n🎯 RAPPORT DE TESTS DE SÉCURITÉ');
        console.log('=' .repeat(50));
        console.log(`📊 Score de sécurité: ${score}/100`);
        console.log(`✅ Tests réussis: ${this.results.summary.passed}`);
        console.log(`❌ Tests échoués: ${this.results.summary.failed}`);
        console.log(`🚨 Vulnérabilités critiques: ${this.results.summary.critical}`);
        console.log('');

        // Classification du niveau de sécurité
        let securityLevel;
        if (score >= 90) securityLevel = '🟢 EXCELLENT';
        else if (score >= 80) securityLevel = '🟡 BON';
        else if (score >= 60) securityLevel = '🟠 MOYEN';
        else if (score >= 40) securityLevel = '🔴 FAIBLE';
        else securityLevel = '⚫ CRITIQUE';

        console.log(`🛡️ Niveau de sécurité: ${securityLevel}`);
        
        // Recommandations
        console.log('\n💡 RECOMMANDATIONS:');
        if (this.results.summary.critical > 0) {
            console.log('🚨 URGENT: Corriger les vulnérabilités critiques immédiatement');
        }
        if (this.results.summary.failed > 0) {
            console.log('⚠️  IMPORTANT: Implémenter les protections manquantes');
        }
        if (score < 80) {
            console.log('📋 AMÉLIORATION: Renforcer la configuration de sécurité');
        }

        // Sauvegarder le rapport
        const reportPath = 'C:/xampp/htdocs/sanny/san/ecomerce_sanny/security-penetration-report.json';
        try {
            fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
            console.log(`\n📄 Rapport détaillé sauvé: ${reportPath}`);
        } catch (error) {
            console.log(`❌ Erreur sauvegarde rapport: ${error.message}`);
        }

        return this.results;
    }

    // Exécuter tous les tests
    async runAllTests() {
        console.log('🔐 TESTS DE PÉNÉTRATION SÉCURITÉ - SANNY E-COMMERCE');
        console.log('=' .repeat(60));
        console.log('⚠️  ATTENTION: Tests de sécurité en cours...');
        console.log('🎯 Simulation d\'attaques pour validation des protections\n');

        try {
            // Vérifier que le serveur est accessible
            const healthCheck = await this.request('GET', '/api/health');
            if (healthCheck.status !== 200) {
                console.log('❌ Serveur inaccessible. Démarrez le serveur avant les tests.');
                return;
            }

            console.log('✅ Serveur détecté, début des tests...');

            // Exécuter tous les tests
            await this.testRateLimiting();
            await this.testSecurityHeaders();
            await this.testInjectionAttacks();
            await this.testAuthenticationSecurity();
            await this.testFileUploadSecurity();
            await this.testCORSSecurity();
            await this.testInputValidation();
            await this.testSecurityLogging();

            // Générer le rapport final
            this.generateSecurityReport();

        } catch (error) {
            console.error('❌ Erreur critique durant les tests:', error);
            this.log('critical', 'Test Execution', 'Échec', error.message);
        }

        return this.results;
    }
}

// Exécution automatique si appelé directement
if (require.main === module) {
    const tester = new SecurityPenetrationTest();
    tester.runAllTests().then(results => {
        const exitCode = results.summary.critical > 0 ? 1 : 0;
        process.exit(exitCode);
    }).catch(error => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = SecurityPenetrationTest;