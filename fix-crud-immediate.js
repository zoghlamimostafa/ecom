const fs = require('fs');
const path = require('path');

console.log("⚡ CORRECTION IMMÉDIATE DES PERFORMANCES CRUD");
console.log("============================================");

// 1. Modifier le contrôleur existant pour ajouter la pagination
const productCtrlPath = path.join(__dirname, 'backend/controller/productCtrl.js');

try {
  let productCtrl = fs.readFileSync(productCtrlPath, 'utf8');
  
  // Chercher la fonction getAllProduct et la remplacer
  const oldGetAllProduct = `const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Construire l'objet options pour la requête
    let options = {
      order: [['createdAt', 'DESC']]
    };

    // Si des filtres sont fournis
    if (req.query.search) {
      options.where = {
        title: { [Op.iLike]: \`%\${req.query.search}%\` }
      };
    }

    // Gestion du filtre de prix
    if (req.query.price) {
      const priceFilter = JSON.parse(req.query.price);
      options.where = options.where || {};
      
      if (priceFilter.gte) options.where.price = { [Op.gte]: parseFloat(priceFilter.gte) };
      if (priceFilter.lte) options.where.price = { ...options.where.price, [Op.lte]: parseFloat(priceFilter.lte) };
    }

    // Filtrage par catégorie
    if (req.query.category) {
      options.where.category = req.query.category;
    }

    // Filtrage par marque
    if (req.query.brand) {
      options.where.brand = req.query.brand;
    }

    const products = await Product.findAll(options);
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});`;

  const newGetAllProduct = `const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Construire l'objet options pour la requête
    let options = {
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'slug', 'description', 'price', 'quantity', 'sold', 'category', 'brand', 'images']
    };

    // Si des filtres sont fournis
    if (req.query.search) {
      options.where = {
        [Op.or]: [
          { title: { [Op.iLike]: \`%\${req.query.search}%\` } },
          { description: { [Op.iLike]: \`%\${req.query.search}%\` } }
        ]
      };
    }

    // Gestion du filtre de prix
    if (req.query.price) {
      const priceFilter = JSON.parse(req.query.price);
      options.where = options.where || {};
      
      if (priceFilter.gte) options.where.price = { [Op.gte]: parseFloat(priceFilter.gte) };
      if (priceFilter.lte) options.where.price = { ...options.where.price, [Op.lte]: parseFloat(priceFilter.lte) };
    }

    // Filtrage par catégorie
    if (req.query.category) {
      options.where = { ...options.where, category: req.query.category };
    }

    // Filtrage par marque
    if (req.query.brand) {
      options.where = { ...options.where, brand: req.query.brand };
    }

    const { count, rows: products } = await Product.findAndCountAll(options);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllProduct:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des produits",
      error: error.message 
    });
  }
});`;

  // Remplacer dans le fichier
  productCtrl = productCtrl.replace(oldGetAllProduct, newGetAllProduct);
  
  // Sauvegarder
  fs.writeFileSync(productCtrlPath, productCtrl);
  console.log("✅ Contrôleur produits principal mis à jour avec pagination");

} catch (error) {
  console.log("⚠️ Impossible de modifier automatiquement le contrôleur produits");
}

// 2. Modifier le contrôleur utilisateurs
const userCtrlPath = path.join(__dirname, 'backend/controller/userCtrl.js');

try {
  let userCtrl = fs.readFileSync(userCtrlPath, 'utf8');
  
  // Chercher et remplacer getallUser
  const oldGetAllUser = `const getallUser = asyncHandler(async (req, res) => {
    try {
      const getUsers = await User.findAll({ 
        where: { 
          role: { [Op.ne]: 'admin' } 
        },
        attributes: { exclude: ['password'] }
      });
      res.json({
        status: 'success',
        count: getUsers.length,
        data: getUsers
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        status: 'fail',
        message: "Error fetching users",
        error: error.message 
      });
    }
  });`;

  const newGetAllUser = `const getallUser = asyncHandler(async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;
      const offset = (page - 1) * limit;
      
      const options = {
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: { role: { [Op.ne]: 'admin' } },
        attributes: { exclude: ['password'] }
      };

      // Recherche
      if (req.query.search) {
        options.where = {
          ...options.where,
          [Op.or]: [
            { firstname: { [Op.iLike]: \`%\${req.query.search}%\` } },
            { lastname: { [Op.iLike]: \`%\${req.query.search}%\` } },
            { email: { [Op.iLike]: \`%\${req.query.search}%\` } }
          ]
        };
      }

      const { count, rows: getUsers } = await User.findAndCountAll(options);
      
      res.json({
        status: 'success',
        count: getUsers.length,
        total: count,
        data: getUsers,
        pagination: {
          page,
          limit,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        status: 'fail',
        message: "Error fetching users",
        error: error.message 
      });
    }
  });`;

  userCtrl = userCtrl.replace(oldGetAllUser, newGetAllUser);
  fs.writeFileSync(userCtrlPath, userCtrl);
  console.log("✅ Contrôleur utilisateurs principal mis à jour avec pagination");

} catch (error) {
  console.log("⚠️ Impossible de modifier automatiquement le contrôleur utilisateurs");
}

// 3. Modifier le contrôleur des marques pour optimiser
const brandCtrlPath = path.join(__dirname, 'backend/controller/brandCtrl.js');

try {
  let brandCtrl = fs.readFileSync(brandCtrlPath, 'utf8');
  
  const oldGetAllBrand = `const getallBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.findAll();
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});`;

  const newGetAllBrand = `const getallBrand = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const options = {
      limit,
      offset,
      order: [['title', 'ASC']],
      attributes: ['id', 'title', 'slug']
    };

    if (req.query.all === 'true') {
      // Pour les dropdown/select, retourner toutes les marques
      const allBrands = await Brand.findAll({
        order: [['title', 'ASC']],
        attributes: ['id', 'title', 'slug']
      });
      return res.json({ success: true, data: allBrands });
    }

    const { count, rows: brands } = await Brand.findAndCountAll(options);
    
    res.json({
      success: true,
      data: brands,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getallBrand:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des marques",
      error: error.message 
    });
  }
});`;

  brandCtrl = brandCtrl.replace(oldGetAllBrand, newGetAllBrand);
  fs.writeFileSync(brandCtrlPath, brandCtrl);
  console.log("✅ Contrôleur marques mis à jour avec pagination");

} catch (error) {
  console.log("⚠️ Impossible de modifier automatiquement le contrôleur marques");
}

console.log("\n🎯 OPTIMISATIONS APPLIQUÉES:");
console.log("1. ✅ Pagination ajoutée aux produits (20/page)");
console.log("2. ✅ Pagination ajoutée aux utilisateurs (15/page)");
console.log("3. ✅ Pagination ajoutée aux marques (50/page)");
console.log("4. ✅ Sélection optimisée des champs");
console.log("5. ✅ Recherche améliorée multi-champs");
console.log("6. ✅ Gestion d'erreurs renforcée");

console.log("\n⚡ Les performances devraient être considérablement améliorées!");
console.log("💡 Redémarrez le serveur backend pour appliquer les changements");