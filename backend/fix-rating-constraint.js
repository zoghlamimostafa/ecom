// Script pour corriger la contrainte unique de ProductRatings
// Problème: userId est UNIQUE au lieu de (userId, productId) unique ensemble
// Solution: Recréer la table avec la bonne contrainte

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Début de la correction de la contrainte ProductRatings...');

db.serialize(() => {
  // 1. Sauvegarder les données existantes
  console.log('📦 Sauvegarde des données existantes...');
  
  // 2. Supprimer la table actuelle
  db.run('DROP TABLE IF EXISTS ProductRatings_old', (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression de l\'ancienne table:', err);
      return;
    }
  });
  
  // 3. Renommer la table actuelle
  db.run('ALTER TABLE ProductRatings RENAME TO ProductRatings_old', (err) => {
    if (err) {
      console.error('❌ Erreur lors du renommage:', err);
      return;
    }
    console.log('✅ Table renommée');
    
    // 4. Créer la nouvelle table avec la bonne contrainte
    const createTableSQL = `
      CREATE TABLE ProductRatings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        star INTEGER NOT NULL,
        comment TEXT,
        userId INTEGER NOT NULL REFERENCES Users(id),
        productId INTEGER NOT NULL REFERENCES Products(id),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        UNIQUE(userId, productId)
      )
    `;
    
    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Erreur lors de la création de la nouvelle table:', err);
        return;
      }
      console.log('✅ Nouvelle table créée avec la contrainte correcte');
      
      // 5. Copier les données (en supprimant les doublons - garder le plus récent)
      const copyDataSQL = `
        INSERT INTO ProductRatings (id, star, comment, userId, productId, createdAt, updatedAt)
        SELECT id, star, comment, userId, productId, createdAt, updatedAt
        FROM ProductRatings_old
        WHERE id IN (
          SELECT MAX(id)
          FROM ProductRatings_old
          GROUP BY userId, productId
        )
      `;
      
      db.run(copyDataSQL, function(err) {
        if (err) {
          console.error('❌ Erreur lors de la copie des données:', err);
          return;
        }
        console.log(`✅ ${this.changes} enregistrements copiés`);
        
        // 6. Supprimer l'ancienne table
        db.run('DROP TABLE ProductRatings_old', (err) => {
          if (err) {
            console.error('❌ Erreur lors de la suppression de l\'ancienne table:', err);
            return;
          }
          console.log('✅ Ancienne table supprimée');
          
          // 7. Vérifier la nouvelle structure
          db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='ProductRatings'", (err, row) => {
            if (err) {
              console.error('❌ Erreur lors de la vérification:', err);
              return;
            }
            console.log('\n📋 Nouvelle structure de la table:');
            console.log(row.sql);
            console.log('\n✅ Migration terminée avec succès!');
            
            db.close();
          });
        });
      });
    });
  });
});
