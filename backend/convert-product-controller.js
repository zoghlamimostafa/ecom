// Script de conversion automatique du contrôleur produits vers Sequelize
const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'controller', 'productCtrl.js');

console.log('🔄 Conversion de productCtrl.js vers Sequelize...');

// Lire le fichier
let content = fs.readFileSync(controllerPath, 'utf8');

// 1. Remplacer findOne avec la syntaxe where
content = content.replace(
  /Product\.findOne\(\{ ([^}]+) \}\)/g, 
  'Product.findOne({ where: { $1 } })'
);

// 2. Remplacer findById par findByPk
content = content.replace(
  /Product\.findById\(([^)]+)\)/g,
  'Product.findByPk($1)'
);

// 3. Remplacer User.findById par User.findByPk
content = content.replace(
  /User\.findById\(([^)]+)\)/g,
  'User.findByPk($1)'
);

// 4. Remplacer find() par findAll()
content = content.replace(
  /Product\.find\(\)/g,
  'Product.findAll()'
);

// 5. Remplacer find({}) par findAll()
content = content.replace(
  /Product\.find\(\{\}\)/g,
  'Product.findAll()'
);

// 6. Remplacer find(query) par findAll({ where: query })
content = content.replace(
  /Product\.find\(\{([^}]+)\}\)/g,
  'Product.findAll({ where: { $1 } })'
);

// 7. Remplacer findByIdAndUpdate par update + findByPk
content = content.replace(
  /const updateProduct = await Product\.findByIdAndUpdate\(\s*([^,]+),\s*([^,]+),\s*\{([^}]+)\}\s*\)/g,
  `await Product.update($2, { where: { id: $1 }, $3 });
    const updateProduct = await Product.findByPk($1)`
);

// 8. Remplacer findByIdAndDelete par destroy
content = content.replace(
  /Product\.findByIdAndDelete\(([^)]+)\)/g,
  'Product.destroy({ where: { id: $1 } })'
);

// 9. Remplacer _id par id
content = content.replace(/_id:/g, 'id:');
content = content.replace(/\$_id/g, '$id');

// 10. Gérer les populate (Sequelize utilise include)
content = content.replace(
  /\.populate\([^)]+\)/g,
  '// TODO: Remplacer par include dans Sequelize'
);

console.log('✅ Conversion de productCtrl.js terminée');
console.log('⚠️  Actions manuelles requises:');
console.log('   - Revoir les clauses populate/include');
console.log('   - Vérifier les requêtes complexes');
console.log('   - Tester les endpoints produits');

// Sauvegarder les changements
fs.writeFileSync(controllerPath, content);
console.log('💾 Fichier sauvegardé');