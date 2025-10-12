// Serveur de démonstration pour la page produit moderne
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'modern-product-demo.html');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page not found');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🌐 Serveur de démonstration démarré !`);
    console.log(`📋 Page de démonstration : http://localhost:${PORT}`);
    console.log(`🎨 Application React : http://localhost:3002`);
    console.log(`\n✨ Le nouveau design de page produit est maintenant actif !`);
    console.log(`\nPour tester :`);
    console.log(`1. Ouvrez http://localhost:3002`);
    console.log(`2. Cliquez sur un produit`);
    console.log(`3. Découvrez le nouveau design moderne !`);
    console.log(`\nPour voir la démonstration : http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur de démonstration...');
    server.close(() => {
        console.log('✅ Serveur fermé proprement');
        process.exit(0);
    });
});