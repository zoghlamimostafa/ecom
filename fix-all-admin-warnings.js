#!/usr/bin/env node

/**
 * Script pour corriger tous les warnings ESLint restants dans l'admin
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // Addblog.js
  {
    file: 'admin-app/src/pages/Addblog.js',
    changes: [
      {
        from: `import { React, useEffect, useState } from "react";`,
        to: `import { React, useEffect } from "react";`
      },
      {
        from: `  }, [getBlogId]);`,
        to: `  }, [getBlogId, dispatch]);`
      },
      {
        from: `  }, [blogState]);`,
        to: `  }, [blogState, dispatch]);`
      },
      {
        from: `  }, [isSuccess, isError, isLoading]);`,
        to: `  }, [isSuccess, isError, isLoading, createdBlog, updatedBlog, navigate]);`
      },
      {
        from: `  }, [images]);`,
        to: `  }, [images, formik.values, img]);`
      }
    ]
  },
  // Addblogcat.js
  {
    file: 'admin-app/src/pages/Addblogcat.js',
    changes: [
      {
        from: `  }, [getBlogCatId]);`,
        to: `  }, [getBlogCatId, dispatch]);`
      },
      {
        from: `  }, [isSuccess, isError, isLoading]);`,
        to: `  }, [isSuccess, isError, isLoading, createBlogCategory, updatedBlogCategory, navigate]);`
      }
    ]
  },
  // Addbrand.js
  {
    file: 'admin-app/src/pages/Addbrand.js',
    changes: [
      {
        from: `  }, [getBrandId]);`,
        to: `  }, [getBrandId, dispatch]);`
      },
      {
        from: `  }, [isSuccess, isError, isLoading, createdBrand]);`,
        to: `  }, [isSuccess, isError, isLoading, createdBrand, updatedBrand, navigate]);`
      }
    ]
  },
  // Addcat.js
  {
    file: 'admin-app/src/pages/Addcat.js',
    changes: [
      {
        from: `  }, [getCategoryId]);`,
        to: `  }, [getCategoryId, dispatch]);`
      },
      {
        from: `  }, [isSuccess, isError, isLoading]);`,
        to: `  }, [isSuccess, isError, isLoading, createdCategory, updatedCategory, navigate]);`
      }
    ]
  },
  // Addcolor.js
  {
    file: 'admin-app/src/pages/Addcolor.js',
    changes: [
      {
        from: `  }, [getColorId]);`,
        to: `  }, [getColorId, dispatch]);`
      },
      {
        from: `  }, [isSuccess, isError, isLoading, createdColor]);`,
        to: `  }, [isSuccess, isError, isLoading, createdColor, updatedColor, navigate]);`
      }
    ]
  },
  // AddproductIntelligent.js
  {
    file: 'admin-app/src/pages/AddproductIntelligent.js',
    changes: [
      {
        from: `import { ShoppingOutlined, TagOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';`,
        to: `import { TagOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';`
      },
      {
        from: `  const [productTags, setProductTags] = useState([]);`,
        to: `  // const [productTags, setProductTags] = useState([]);`
      }
    ]
  },
  // CreateAdmin.js
  {
    file: 'admin-app/src/pages/CreateAdmin.js',
    changes: [
      {
        from: `    const response = await axios.post(base_url + "user/admin-register", values);`,
        to: `    await axios.post(base_url + "user/admin-register", values);`
      }
    ]
  },
  // Listes - ajouter dispatch aux dépendances
  {
    file: 'admin-app/src/pages/Blogcatlist.js',
    changes: [
      {
        from: `  }, []);`,
        to: `  }, [dispatch]);`
      }
    ]
  },
  {
    file: 'admin-app/src/pages/Bloglist.js',
    changes: [
      {
        from: `  }, []);`,
        to: `  }, [dispatch]);`
      }
    ]
  },
  {
    file: 'admin-app/src/pages/Categorylist.js',
    changes: [
      {
        from: `  }, []);`,
        to: `  }, [dispatch]);`
      }
    ]
  },
  {
    file: 'admin-app/src/pages/Couponlist.js',
    changes: [
      {
        from: `  }, []);`,
        to: `  }, [dispatch]);`
      }
    ]
  },
  {
    file: 'admin-app/src/pages/Enquiries.js',
    changes: [
      {
        from: `  }, []);`,
        to: `  }, [dispatch]);`
      }
    ]
  },
  {
    file: 'admin-app/src/pages/ViewEnq.js',
    changes: [
      {
        from: `  }, [enqId]);`,
        to: `  }, [enqId, dispatch]);`
      }
    ]
  }
];

const basePath = path.join(__dirname);

let totalFixed = 0;
let totalErrors = 0;

console.log('🔧 Correction des warnings ESLint dans l\'admin...\n');

fixes.forEach(({ file, changes }) => {
  const filePath = path.join(basePath, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    totalErrors++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  changes.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(from, to);
      fileFixed++;
      totalFixed++;
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - ${fileFixed} corrections appliquées`);
  } else {
    console.log(`ℹ️  ${file} - Aucune correction nécessaire`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ ${totalFixed} warnings corrigés`);
console.log(`   ⚠️  ${totalErrors} erreurs`);
console.log(`\n🎉 Terminé!\n`);
