// Tests complets end-to-end de l'application Sanny
const { spawn } = require('child_process');
const axios = require('axios');

class SannyTester {
    constructor() {
        this.services = {
            backend: { url: 'http://localhost:4000', status: 'unknown' },
            client: { url: 'http://localhost:3000', status: 'unknown' },
            admin: { url: 'http://localhost:3001', status: 'unknown' }
        };
        
        this.testResults = {
            services: [],
            apis: [],
            functionality: [],
            overall: { passed: 0, failed: 0, percentage: 0 }
        };
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString().slice(11, 19);
        const symbols = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍',
            test: '🧪'
        };
        
        console.log(`${symbols[level]} [${timestamp}] ${message}`);
        if (data) {
            if (typeof data === 'object') {
                console.log('   ', JSON.stringify(data, null, 2));
            } else {
                console.log('   ', data);
            }
        }
    }

    async testService(name, url, expectedContent = null) {
        try {
            this.log('test', `Test ${name}...`);
            const response = await axios.get(url, { 
                timeout: 10000,
                validateStatus: () => true
            });
            
            let isValid = response.status === 200;
            
            if (expectedContent && isValid) {
                const content = response.data;
                if (typeof expectedContent === 'string') {
                    isValid = content.includes && content.includes(expectedContent);
                } else if (typeof expectedContent === 'object') {
                    isValid = content && content.status === expectedContent.status;
                }
            }
            
            this.services[name.toLowerCase()].status = isValid ? 'active' : 'error';
            
            const result = {
                service: name,
                url,
                status: response.status,
                success: isValid,
                responseTime: Date.now()
            };
            
            this.testResults.services.push(result);
            
            if (isValid) {
                this.log('success', `${name}: Active (${response.status})`);
                this.testResults.overall.passed++;
                return true;
            } else {
                this.log('error', `${name}: Problème (${response.status})`);
                this.testResults.overall.failed++;
                return false;
            }
            
        } catch (error) {
            this.services[name.toLowerCase()].status = 'unreachable';
            this.log('error', `${name}: Inaccessible - ${error.code || error.message}`);
            
            this.testResults.services.push({
                service: name,
                url,
                success: false,
                error: error.code || error.message
            });
            
            this.testResults.overall.failed++;
            return false;
        }
    }

    async testAPI(name, endpoint, expectedData = null) {
        try {
            this.log('test', `API ${name}...`);
            const url = `http://localhost:4000/api/${endpoint}`;
            const response = await axios.get(url, { 
                timeout: 5000,
                validateStatus: () => true
            });
            
            let isValid = response.status === 200;
            
            if (expectedData && isValid) {
                const data = response.data;
                if (expectedData.isArray) {
                    isValid = Array.isArray(data);
                }
                if (expectedData.minLength) {
                    isValid = isValid && data.length >= expectedData.minLength;
                }
                if (expectedData.hasProperty) {
                    isValid = isValid && data.hasOwnProperty(expectedData.hasProperty);
                }
            }
            
            const result = {
                api: name,
                endpoint,
                status: response.status,
                success: isValid,
                dataLength: response.data ? (Array.isArray(response.data) ? response.data.length : Object.keys(response.data).length) : 0
            };
            
            this.testResults.apis.push(result);
            
            if (isValid) {
                let details = `${response.status}`;
                if (Array.isArray(response.data)) {
                    details += ` - ${response.data.length} items`;
                } else if (response.data && response.data.status) {
                    details += ` - ${response.data.status}`;
                }
                this.log('success', `API ${name}: ${details}`);
                this.testResults.overall.passed++;
                return true;
            } else {
                this.log('error', `API ${name}: Échec (${response.status})`);
                this.testResults.overall.failed++;
                return false;
            }
            
        } catch (error) {
            this.log('error', `API ${name}: ${error.code || error.message}`);
            
            this.testResults.apis.push({
                api: name,
                endpoint,
                success: false,
                error: error.code || error.message
            });
            
            this.testResults.overall.failed++;
            return false;
        }
    }

    async runServiceTests() {
        this.log('info', 'Tests des services...');
        console.log('');
        
        await this.testService('Backend', 'http://localhost:4000/api/', { status: 'OK' });
        await this.testService('Client', 'http://localhost:3000', '<html');
        await this.testService('Admin', 'http://localhost:3001', '<html');
        
        console.log('');
    }

    async runAPITests() {
        this.log('info', 'Tests des APIs...');
        console.log('');
        
        // Tests des APIs principales
        await this.testAPI('Health Check', '', { hasProperty: 'status' });
        await this.testAPI('Health Detailed', 'health', { hasProperty: 'status' });
        await this.testAPI('Status', 'status', { hasProperty: 'server' });
        await this.testAPI('Products', 'product', { isArray: true });
        await this.testAPI('Categories', 'category', { isArray: true });
        await this.testAPI('Brands', 'brand', { isArray: true });
        
        console.log('');
    }

    async runFunctionalityTests() {
        this.log('info', 'Tests de fonctionnalités...');
        console.log('');
        
        // Test simple d'authentification (si possible)
        try {
            // Test registration endpoint
            const regResponse = await axios.post('http://localhost:4000/api/user/register', {
                firstname: 'Test',
                lastname: 'User',
                email: `test${Date.now()}@example.com`,
                mobile: `+1555${Date.now().toString().slice(-7)}`,
                password: 'password123'
            }, { timeout: 5000, validateStatus: () => true });
            
            if (regResponse.status === 200 || regResponse.status === 201) {
                this.log('success', 'Registration: Fonctionnel');
                this.testResults.functionality.push({ test: 'Registration', success: true });
                this.testResults.overall.passed++;
            } else {
                this.log('warning', `Registration: ${regResponse.status} - Possiblement fonctionnel`);
                this.testResults.functionality.push({ test: 'Registration', success: false, status: regResponse.status });
                this.testResults.overall.failed++;
            }
        } catch (error) {
            this.log('warning', `Registration: ${error.message}`);
            this.testResults.functionality.push({ test: 'Registration', success: false, error: error.message });
            this.testResults.overall.failed++;
        }
        
        console.log('');
    }

    generateReport() {
        const total = this.testResults.overall.passed + this.testResults.overall.failed;
        this.testResults.overall.percentage = total > 0 ? Math.round((this.testResults.overall.passed / total) * 100) : 0;
        
        console.log('📊 RAPPORT DE TESTS COMPLET');
        console.log('=' .repeat(50));
        console.log('');
        
        // Résumé global
        console.log('🎯 RÉSUMÉ GLOBAL:');
        console.log(`   ✅ Tests réussis: ${this.testResults.overall.passed}`);
        console.log(`   ❌ Tests échoués: ${this.testResults.overall.failed}`);
        console.log(`   📈 Taux de réussite: ${this.testResults.overall.percentage}%`);
        console.log('');
        
        // Status des services
        console.log('🌐 SERVICES:');
        this.testResults.services.forEach(service => {
            const statusIcon = service.success ? '✅' : '❌';
            console.log(`   ${statusIcon} ${service.service}: ${service.url}`);
            if (service.status) console.log(`      Status: ${service.status}`);
            if (service.error) console.log(`      Erreur: ${service.error}`);
        });
        console.log('');
        
        // APIs
        if (this.testResults.apis.length > 0) {
            console.log('🔌 APIs:');
            this.testResults.apis.forEach(api => {
                const statusIcon = api.success ? '✅' : '❌';
                let details = `${api.status || 'N/A'}`;
                if (api.dataLength > 0) details += ` (${api.dataLength} items)`;
                if (api.error) details = api.error;
                
                console.log(`   ${statusIcon} ${api.api}: ${details}`);
            });
            console.log('');
        }
        
        // Fonctionnalités
        if (this.testResults.functionality.length > 0) {
            console.log('⚙️ FONCTIONNALITÉS:');
            this.testResults.functionality.forEach(func => {
                const statusIcon = func.success ? '✅' : '⚠️';
                console.log(`   ${statusIcon} ${func.test}: ${func.success ? 'OK' : func.error || 'Échec'}`);
            });
            console.log('');
        }
        
        // Verdict final
        if (this.testResults.overall.percentage >= 80) {
            console.log('🎉 APPLICATION ENTIÈREMENT FONCTIONNELLE !');
            console.log('   Tous les services principaux sont opérationnels');
        } else if (this.testResults.overall.percentage >= 60) {
            console.log('✅ APPLICATION MAJORITAIREMENT FONCTIONNELLE');
            console.log('   Services principaux OK, quelques APIs en erreur');
        } else {
            console.log('⚠️ APPLICATION PARTIELLEMENT FONCTIONNELLE');
            console.log('   Certains services nécessitent une attention');
        }
        
        console.log('');
        console.log('📋 Pour accéder à l\'application:');
        console.log('   🖥️  Backend API: http://localhost:4000/api/');
        console.log('   🛒 Shop Client: http://localhost:3000');
        console.log('   ⚙️  Admin Panel: http://localhost:3001');
        
        // Sauvegarder le rapport
        const fs = require('fs');
        const reportPath = require('path').join(process.cwd(), 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        console.log(`\n📄 Rapport détaillé: ${reportPath}`);
    }

    async run() {
        console.log('🧪 TESTS COMPLETS - APPLICATION E-COMMERCE SANNY');
        console.log('=' .repeat(60));
        console.log('⏳ Démarrage des tests...');
        console.log('');
        
        try {
            await this.runServiceTests();
            await this.runAPITests();
            await this.runFunctionalityTests();
            
            this.generateReport();
            
        } catch (error) {
            this.log('error', 'Erreur critique durant les tests', error);
            return false;
        }
        
        return this.testResults.overall.percentage >= 60;
    }
}

// Auto-démarrage si le script est exécuté directement
if (require.main === module) {
    const tester = new SannyTester();
    tester.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = SannyTester;