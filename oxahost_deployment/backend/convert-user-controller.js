// Script de conversion automatique du contrôleur utilisateur vers Sequelize
const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'controller', 'userCtrl.js');

console.log('🔄 Conversion de userCtrl.js vers Sequelize...');

// Lire le fichier
let content = fs.readFileSync(controllerPath, 'utf8');

// 1. Remplacer findOne avec la syntaxe where
content = content.replace(
  /User\.findOne\(\{ ([^}]+) \}\)/g, 
  'User.findOne({ where: { $1 } })'
);

// 2. Remplacer findById par findByPk
content = content.replace(
  /User\.findById\(([^)]+)\)/g,
  'User.findByPk($1)'
);

// 3. Remplacer findByIdAndUpdate par update + findByPk
content = content.replace(
  /const updateuser = await User\.findByIdAndUpdate\(\s*([^,]+),\s*\{([^}]+)\},\s*\{([^}]+)\}\s*\)/g,
  `await User.update({ $2 }, { where: { id: $1 }, $3 });
    const updateuser = await User.findByPk($1)`
);

// 4. Remplacer _id par id dans les objets de retour
content = content.replace(/_id:/g, 'id:');
content = content.replace(/findUser\?\._id/g, 'findUser?.id');
content = content.replace(/findAdmin\?\._id/g, 'findAdmin?.id');

// 5. Remplacer les références à isPasswordMatched (méthode personnalisée)
// Note: Cette méthode devra être définie dans le modèle Sequelize

console.log('✅ Conversion terminée');
console.log('⚠️  Actions manuelles requises:');
console.log('   - Vérifier la méthode isPasswordMatched dans le modèle User');
console.log('   - Vérifier les méthodes de tokens');
console.log('   - Tester les endpoints');

// Sauvegarder les changements
fs.writeFileSync(controllerPath, content);
console.log('💾 Fichier sauvegardé');