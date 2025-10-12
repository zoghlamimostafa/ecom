const fs = require('fs');
const path = require('path');

// Mots anglais courants à rechercher
const englishWords = [
  'Login', 'Sign', 'Email', 'Password', 'Cart', 'Wishlist', 'Compare', 
  'Price', 'Total', 'Quantity', 'Order', 'Product', 'Category', 'Brand',
  'Filter', 'Sort', 'Loading', 'Error', 'Success', 'Warning', 'Search',
  'Add to cart', 'Add to wishlist', 'Buy now', 'View details', 'Quick view',
  'Out of stock', 'In stock', 'Free shipping', 'Checkout', 'Continue shopping',
  'My account', 'My orders', 'Log out', 'Register', 'Forgot password',
  'Reviews', 'Rating', 'Description', 'Specifications', 'Related products',
  'Popular products', 'New products', 'Best sellers', 'Featured', 'Sale',
  'Discount', 'Coupon', 'Apply', 'Remove', 'Update', 'Continue', 'Back',
  'Next', 'Previous', 'Submit', 'Cancel', 'Close', 'Save', 'Edit', 'Delete',
  'Confirm', 'Address', 'Phone', 'Name', 'First name', 'Last name',
  'Shipping address', 'Billing address', 'Payment method', 'Cash on delivery',
  'Credit card', 'Delivery', 'Track order', 'Order history', 'Contact us',
  'Newsletter', 'Subscribe', 'Follow us', 'About us', 'Terms', 'Privacy',
  'Refund policy', 'Shipping policy', 'FAQ', 'Help', 'Support', 'Blog',
  'News', 'Home', 'Shop', 'Store', 'Products', 'Categories', 'Brands',
  'Favorites', 'Basket', 'Account', 'Profile', 'Settings', 'Show more',
  'Show less', 'Load more', 'View more', 'See all', 'No results', 'Try again'
];

// Chercher dans les fichiers
function searchFiles(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      searchFiles(filePath, results);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        englishWords.forEach(word => {
          const regex = new RegExp(`["'\`]${word}["'\`]|>${word}<`, 'i');
          if (regex.test(line)) {
            results.push({
              file: filePath.replace('/home/blackrdp/sanny/san/ecomerce_sanny/', ''),
              line: index + 1,
              content: line.trim().substring(0, 100),
              word
            });
          }
        });
      });
    }
  }
  
  return results;
}

console.log('🔍 Recherche des textes anglais non traduits...\n');
const results = searchFiles('./Client/src/pages');
const results2 = searchFiles('./Client/src/components');

const allResults = [...results, ...results2];

console.log(`📊 Résultats: ${allResults.length} occurrences trouvées\n`);

// Grouper par fichier
const byFile = {};
allResults.forEach(result => {
  if (!byFile[result.file]) {
    byFile[result.file] = [];
  }
  byFile[result.file].push(result);
});

// Afficher les résultats
Object.keys(byFile).sort().forEach(file => {
  console.log(`\n📄 ${file} (${byFile[file].length} occurrences)`);
  byFile[file].slice(0, 5).forEach(result => {
    console.log(`   Ligne ${result.line}: "${result.word}"`);
  });
  if (byFile[file].length > 5) {
    console.log(`   ... et ${byFile[file].length - 5} autres`);
  }
});

console.log(`\n\n✅ Total: ${allResults.length} textes en anglais à traduire`);
