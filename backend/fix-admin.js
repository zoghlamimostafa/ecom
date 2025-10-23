const { User } = require('./models');
const bcrypt = require('bcrypt');

async function fixAdmin() {
  try {
    console.log("🔍 Recherche du compte admin...");
    
    const admin = await User.findOne({ where: { email: 'admin@admin.com' } });
    
    if (admin) {
      console.log('👤 Admin trouvé:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        firstname: admin.firstname,
        lastname: admin.lastname
      });
      
      // Vérifier si le mot de passe est correct
      const isMatch = await bcrypt.compare('admin123', admin.password);
      console.log('🔑 Mot de passe "admin123":', isMatch ? '✅ Correct' : '❌ Incorrect');
      
      if (!isMatch || admin.role !== 'admin') {
        console.log('🔧 Mise à jour de l\'admin...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await User.update({ 
          password: hashedPassword,
          role: 'admin'
        }, { 
          where: { id: admin.id } 
        });
        
        console.log('✅ Admin mis à jour avec succès');
        console.log('📧 Email: admin@admin.com');
        console.log('🔑 Password: admin123');
        console.log('👤 Role: admin');
      } else {
        console.log('✅ Admin déjà correct');
      }
    } else {
      console.log('❌ Aucun admin trouvé. Création...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const newAdmin = await User.create({
        firstname: 'Admin',
        lastname: 'System',
        email: 'admin@admin.com',
        mobile: '0000000000',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin créé avec succès:', {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role
      });
      console.log('📧 Email: admin@admin.com');
      console.log('🔑 Password: admin123');
    }
    
    // Vérifier tous les admins
    console.log('\n📋 Liste de tous les admins:');
    const allAdmins = await User.findAll({ where: { role: 'admin' } });
    allAdmins.forEach(a => {
      console.log(`  - ${a.email} (ID: ${a.id}, Role: ${a.role})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
  }
  
  process.exit(0);
}

fixAdmin();
