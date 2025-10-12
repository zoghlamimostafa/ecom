const fs = require('fs');
const path = require('path');

// Chemin vers le fichier App.css
const filePath = path.join(__dirname, 'Client', 'src', 'App.css');

console.log('🔧 Script de remplacement Poppins → EB Garamond');
console.log(`📁 Fichier: ${filePath}`);

// Lire le contenu du fichier
let content = fs.readFileSync(filePath, 'utf8');

// Compter les occurrences avant remplacement
const occurrencesBefore = (content.match(/font-family: 'Poppins', sans-serif;/g) || []).length;
console.log(`📊 Occurrences de "font-family: 'Poppins', sans-serif;" trouvées: ${occurrencesBefore}`);

// Effectuer les remplacements
const updatedContent = content.replace(/font-family: 'Poppins', sans-serif;/g, "font-family: 'EB Garamond', serif;");

// Compter les occurrences après remplacement
const occurrencesAfter = (updatedContent.match(/font-family: 'Poppins', sans-serif;/g) || []).length;

// Sauvegarder le fichier mis à jour
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log(`✅ Remplacement terminé!`);
console.log(`📊 Occurrences restantes: ${occurrencesAfter}`);
console.log(`🔄 ${occurrencesBefore - occurrencesAfter} remplacements effectués`);

if (occurrencesAfter === 0) {
    console.log('🎉 Tous les "Poppins" ont été remplacés par "EB Garamond" !');
} else {
    console.log('⚠️  Il reste encore des occurrences à traiter manuellement.');
}