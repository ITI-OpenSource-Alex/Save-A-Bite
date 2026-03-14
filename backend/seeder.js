import mongoose from "mongoose";

import { Product } from "./dist/models/product.model.cjs";

import { Category } from "./dist/models/category.model.cjs";

import StorePkg from "./dist/models/store.model.cjs";
const Store = StorePkg.default || StorePkg;

const MONGO_URI = "mongodb://127.0.0.1:27017/bite";

/* ================= CONNECT DB ================= */

await mongoose.connect(MONGO_URI);
console.log("MongoDB connected");

/* ================= CLEAN DATABASE ================= */

await Product.deleteMany({});
await Category.deleteMany({});
await Store.deleteMany({});

console.log("Old data removed");

/* ================= CATEGORIES ================= */

const categories = await Category.insertMany([
  { name: "Meals" },
  { name: "Desserts" },
  { name: "Bakeries" },
  { name: "Grocery" },
  { name: "Drinks" },
]);

console.log("Categories created");

/* ================= STORES ================= */

const stores = await Store.insertMany([
  {
    name: "Alex Grill House",
    description: "Fresh grilled meals",
    ownerId: new mongoose.Types.ObjectId(),
    phone: "0123456789",
    email: "alexgrill@email.com",
    logoUrl:
      "https://static.vecteezy.com/system/resources/previews/028/283/923/non_2x/grill-house-barbecue-rustic-logo-design-retro-bbq-barbeque-bar-and-restaurant-icon-red-fire-icon-vector.jpg",
  },

  {
    name: "Sweet Bite",
    description: "Desserts and cakes",
    ownerId: new mongoose.Types.ObjectId(),
    phone: "0112345678",
    email: "sweetbite@email.com",
    logoUrl:
      "https://logoarena-storage.s3.amazonaws.com/contests/public/6984/14668_1461922691_sweeo.png",
  },

  {
    name: "Golden Bakery",
    description: "Fresh bakery products",
    ownerId: new mongoose.Types.ObjectId(),
    phone: "0102345678",
    email: "golden@email.com",
    logoUrl:
      "https://cdn.dribbble.com/userupload/41177961/file/original-6253656d5b9e192c18f612f46bc5f109.png?resize=752x&vertical=center",
  },

  {
    name: "Daily Market",
    description: "Groceries and essentials",
    ownerId: new mongoose.Types.ObjectId(),
    phone: "0129988776",
    email: "market@email.com",
    logoUrl: "https://instepmv.com/cdn/shop/files/TDM-02_1200x1200.png?v=1743230838",
  },

  {
    name: "Chill Cup",
    description: "Fresh juices and drinks",
    ownerId: new mongoose.Types.ObjectId(),
    phone: "0119988776",
    email: "juice@email.com",
    logoUrl:
      "https://e0b309a85da6d7a17e0e.cdn6.editmysite.com/uploads/b/e0b309a85da6d7a17e0e1215c688fd969d565f149139e91dc22444b5f21a478f/Black%20and%20White%20Retro%20Playful%20Simple%20Circle%20Coffee%20Logo%20%28400%20x%20400%20mm%29_1723020004.png?width=2400&optimize=medium",
  },
]);

console.log("Stores created");

/* ================= PRODUCTS ================= */

const products = [
  /* ===== MEALS ===== */

  {
    name: "Chicken Shawarma Plate",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: [
      "https://sohappyyoulikedit.com/wp-content/uploads/2025/09/Sheet-Pan-Chicken-Shawarma-2.jpg",
    ],
    price: 120,
    stock: 40,
    description: "Grilled chicken shawarma served with fries and garlic sauce",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Beef Burger Combo",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=800"],
    price: 150,
    stock: 35,
    description: "Juicy beef burger with cheese and fries",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Grilled Chicken Meal",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: ["https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"],
    price: 170,
    stock: 25,
    description: "Grilled chicken breast with rice and vegetables",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Margherita Pizza",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"],
    price: 140,
    stock: 30,
    description: "Classic pizza with tomato sauce and mozzarella",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Grilled Steak Plate",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
    price: 260,
    stock: 15,
    description: "Juicy grilled steak with mashed potatoes",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Chicken Alfredo Pasta",
    storeId: stores[0]._id,
    categoryId: categories[0]._id,
    images: ["https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800"],
    price: 165,
    stock: 22,
    description: "Creamy alfredo pasta topped with grilled chicken",
    isActive: true,
    isDeleted: false,
  },

  /* ===== DESSERTS ===== */

  {
    name: "Chocolate Cake",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: ["https://static.toiimg.com/thumb/53096885.cms?imgsize=1572013&width=800&height=800"],
    price: 80,
    stock: 20,
    description: "Rich chocolate cake slice with frosting",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Strawberry Cheesecake",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: ["https://drivemehungry.com/wp-content/uploads/2022/07/strawberry-cheesecake-11.jpg"],
    price: 95,
    stock: 18,
    description: "Creamy cheesecake topped with strawberries",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Chocolate Donuts",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: [
      "https://www.shugarysweets.com/wp-content/uploads/2020/01/baked-chocolate-donuts-recipe.jpg",
    ],
    price: 45,
    stock: 40,
    description: "Soft donuts covered with chocolate glaze",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Vanilla Cupcake",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: ["https://natashaskitchen.com/wp-content/uploads/2020/05/Vanilla-Cupcakes-3.jpg"],
    price: 35,
    stock: 30,
    description: "Fluffy vanilla cupcake with buttercream frosting",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Ice Cream Sundae",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: [
      "https://www.chocolatemoosey.com/wp-content/uploads/2016/04/Fried-Ice-Cream-Sundaes-3227.jpg",
    ],
    price: 60,
    stock: 25,
    description: "Vanilla ice cream topped with chocolate syrup",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Brownie",
    storeId: stores[1]._id,
    categoryId: categories[1]._id,
    images: [
      "https://www.allrecipes.com/thmb/Bf_v7CGEIk1T0KOYsBeGdcs56Lo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-9599-Quick-Easy-Brownies-ddmfs-4x3-697df57aa40a45f8a7bdb3a089eee2e5.jpg",
    ],
    price: 50,
    stock: 28,
    description: "Chocolate brownie with rich cocoa flavor",
    isActive: true,
    isDeleted: false,
  },

  /* ===== BAKERIES ===== */

  {
    name: "Butter Croissant",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: [
      "https://gourmetegypt.com/media/catalog/product/f/r/french_mini_butter_croissant_.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=",
    ],
    price: 25,
    stock: 60,
    description: "Fresh baked buttery croissant",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "French Baguette",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: ["https://www.kingarthurbaking.com/sites/default/files/recipe_legacy/8-3-large.jpg"],
    price: 20,
    stock: 70,
    description: "Classic crispy baguette loaf",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Cinnamon Rolls",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: [
      "https://cdn.bakedbyrachel.com/wp-content/uploads/2015/06/mapleglazedcinnrolls_bakedbyrachel-3.jpg",
    ],
    price: 40,
    stock: 45,
    description: "Soft rolls with cinnamon and sugar glaze",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Chocolate Croissant",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: [
      "https://bakeandsavor.com/wp-content/uploads/2025/10/Homemade-Chocolate-Croissant-500x500.jpg",
    ],
    price: 35,
    stock: 38,
    description: "Flaky croissant filled with chocolate",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Blueberry Muffin",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: ["https://bakerbynature.com/wp-content/uploads/2011/05/Blueberry-Muffins-1-of-1.jpg"],
    price: 30,
    stock: 50,
    description: "Soft muffin packed with blueberries",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Sourdough Bread",
    storeId: stores[2]._id,
    categoryId: categories[2]._id,
    images: ["https://fareisle.com/wp-content/uploads/2020/04/sourdough-bread-ecourse-05-2.jpg"],
    price: 28,
    stock: 42,
    description: "Traditional sourdough bread loaf",
    isActive: true,
    isDeleted: false,
  },

  /* ===== GROCERY ===== */

  {
    name: "Organic Eggs",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: [
      "https://thefarmersstore.com.au/cdn/shop/products/1_296979cd-5a3c-4b18-bf1c-f023b0d11bdb.png?v=1595647918&width=2160",
    ],
    price: 70,
    stock: 80,
    description: "12 pack fresh organic eggs",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Olive Oil",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: [
      "https://jayporeolives.com/cdn/shop/files/WhatsAppImage2025-08-05at11.42.23AM-2_1200x1200.jpg?v=1754374704",
    ],
    price: 180,
    stock: 35,
    description: "Extra virgin olive oil bottle",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Fresh Tomatoes",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: ["https://foodal.com/wp-content/uploads/2016/08/three-tomatoes.jpg"],
    price: 25,
    stock: 100,
    description: "Fresh red tomatoes",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Organic Milk",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: ["https://cdn.salla.sa/wpzly/Ka0nlzCrSvC95z2uDbeIFLbbIbfhbs1vaY0kNMfc.jpg"],
    price: 40,
    stock: 60,
    description: "1 liter organic milk",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Pasta Pack",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: [
      "https://cdn.mafrservices.com/sys-master-root/hd3/h85/14610304696350/544719_main.jpg?im=Resize=376",
    ],
    price: 35,
    stock: 75,
    description: "Italian pasta pack",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Rice Bag",
    storeId: stores[3]._id,
    categoryId: categories[3]._id,
    images: ["https://cdn.mafrservices.com/sys-master-root/h37/hfc/15127735435294/433716_main.jpg"],
    price: 120,
    stock: 55,
    description: "Premium white rice bag",
    isActive: true,
    isDeleted: false,
  },

  /* ===== DRINKS ===== */

  {
    name: "Fresh Orange Juice",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: [
      "https://www.kitchentreaty.com/wp-content/uploads/2025/03/fresh-squeezed-orange-juice-2.jpg",
    ],
    price: 35,
    stock: 50,
    description: "Fresh squeezed orange juice",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Mango Smoothie",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: ["https://lovingitvegan.com/wp-content/uploads/2016/10/Mango-Smoothie-2.jpg"],
    price: 45,
    stock: 40,
    description: "Cold mango smoothie",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Iced Coffee",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: ["https://simplegraytshirt.com/wp-content/uploads/2024/11/iced-mocha-coffee-03.jpg"],
    price: 40,
    stock: 35,
    description: "Cold brewed iced coffee",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Strawberry Milkshake",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: [
      "https://www.butteredsideupblog.com/wp-content/uploads/2023/06/How-to-Make-a-Strawberry-Milkshake-Without-Ice-Cream-17-scaled.jpg",
    ],
    price: 50,
    stock: 32,
    description: "Creamy strawberry milkshake",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Lemon Mint Juice",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: [
      "https://thetravelbite.com/wp-content/uploads/2021/06/Mint-Lemonade-TheTravelBite.com-16-scaled-720x540.jpg",
    ],
    price: 30,
    stock: 45,
    description: "Refreshing lemon mint juice",
    isActive: true,
    isDeleted: false,
  },

  {
    name: "Cold Brew Coffee",
    storeId: stores[4]._id,
    categoryId: categories[4]._id,
    images: [
      "https://lifemadesweeter.com/wp-content/uploads/Easy-Cold-Brew-Coffee-Recipe-Vegan-Dairy-Free-Paleo-Healthy.jpg",
    ],
    price: 55,
    stock: 25,
    description: "Smooth cold brew coffee",
    isActive: true,
    isDeleted: false,
  },
];

await Product.insertMany(products);

console.log("Products inserted");

/* ================= FINISH ================= */

console.log("Database seeded successfully");

mongoose.connection.close();
