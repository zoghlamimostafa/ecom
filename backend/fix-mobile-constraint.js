const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Correction de la contrainte UNIQUE sur le champ mobile...\n');

db.serialize(() => {
  // 1. Créer une nouvelle table sans la contrainte UNIQUE sur mobile
  console.log('📝 Étape 1: Création d\'une nouvelle table temporaire...');
  db.run(`
    CREATE TABLE IF NOT EXISTS Users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mobile TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      isBlocked INTEGER DEFAULT 0,
      address TEXT,
      refreshToken TEXT,
      passwordChangedAt TEXT,
      passwordResetToken TEXT,
      passwordResetExpires TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur lors de la création de la table temporaire:', err);
      return;
    }
    console.log('✅ Table temporaire créée');

    // 2. Copier les données de l'ancienne table vers la nouvelle
    console.log('\n📝 Étape 2: Copie des données...');
    db.run(`
      INSERT INTO Users_new 
      SELECT id, firstname, lastname, email, mobile, password, role, isBlocked, 
             address, refreshToken, passwordChangedAt, passwordResetToken, 
             passwordResetExpires, createdAt, updatedAt
      FROM Users
    `, (err) => {
      if (err) {
        console.error('❌ Erreur lors de la copie des données:', err);
        return;
      }
      console.log('✅ Données copiées avec succès');

      // 3. Supprimer l'ancienne table
      console.log('\n📝 Étape 3: Suppression de l\'ancienne table...');
      db.run(`DROP TABLE Users`, (err) => {
        if (err) {
          console.error('❌ Erreur lors de la suppression de l\'ancienne table:', err);
          return;
        }
        console.log('✅ Ancienne table supprimée');

        // 4. Renommer la nouvelle table
        console.log('\n📝 Étape 4: Renommage de la nouvelle table...');
        db.run(`ALTER TABLE Users_new RENAME TO Users`, (err) => {
          if (err) {
            console.error('❌ Erreur lors du renommage:', err);
            return;
          }
          console.log('✅ Nouvelle table renommée');

          // Vérification finale
          console.log('\n🔍 Vérification finale...');
          db.all(`PRAGMA table_info(Users)`, [], (err, rows) => {
            if (err) {
              console.error('❌ Erreur lors de la vérification:', err);
              return;
            }
            
            console.log('\n📋 Structure de la table Users:');
            console.log('-------------------------------------');
            rows.forEach(row => {
              console.log(`${row.name}: ${row.type} ${row.pk ? '(PRIMARY KEY)' : ''} ${row.notnull ? 'NOT NULL' : ''}`);
            });
            
            // Compter les utilisateurs
            db.get(`SELECT COUNT(*) as count FROM Users`, [], (err, row) => {
              if (err) {
                console.error('❌ Erreur lors du comptage:', err);
              } else {
                console.log(`\n✅ Total d'utilisateurs: ${row.count}`);
              }
              
              console.log('\n🎉 Migration terminée avec succès!');
              console.log('👉 Vous pouvez maintenant redémarrer le backend.\n');
              
              db.close();
            });
          });
        });
      });
    });
  });
});
