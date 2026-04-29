const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'frontend/src/app/core/services/auth.service.ts',
  'frontend/src/app/core/services/cart.service.ts',
  'frontend/src/app/core/services/flash-deals.ts',
  'frontend/src/app/features/search/product-filter/product-filter/product-filter.ts',
  'frontend/src/app/features/home/restaurants/restaurants.ts',
  'frontend/src/app/core/services/notification.ts',
  'frontend/src/app/layout/categories-section/categories-section.ts',
  'frontend/src/app/core/services/order.ts',
  'frontend/src/app/core/services/product.ts',
  'frontend/src/app/features/cart/components/order-summary/order-summary.component.ts',
  'frontend/src/app/core/services/vendor.service.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    if (content.includes("environment.apiUrl + '/'")) {
      content = content.replace(/environment\.apiUrl \+ '\/'/g, "environment.apiUrl + '/");
      modified = true;
    }
    if (content.includes('environment.apiUrl + "/"')) {
      content = content.replace(/environment\.apiUrl \+ "\/"/g, 'environment.apiUrl + "/');
      modified = true;
    }
    // Check for another possible syntax error: double quotes around the whole thing
    if (content.includes("'environment.apiUrl")) {
      content = content.replace(/'environment\.apiUrl/g, 'environment.apiUrl');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed syntax in ' + file);
    }
  }
});
