import mongoose from 'mongoose';
import dns from 'dns';
import '../Config/env.js';
import Category from '../Models/categoriesschema.js';
import Product from '../Models/productschema.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const productsByCategory = {
  'Electronics': [
    { name: 'Ultrabook Pro 15', description: '15.6" FHD display, Intel i7, 16GB RAM, 512GB SSD. Perfect for professionals.', price: 1299, discount: 10, discountprice: 1169, quantity: 25, ptype: 'Laptops', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&fit=crop'] },
    { name: 'Galaxy S25 Ultra', description: '6.9" Dynamic AMOLED, 200MP camera, 5000mAh battery.', price: 1199, discount: 5, discountprice: 1139, quantity: 50, ptype: 'Mobiles', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&fit=crop'] },
    { name: 'SonicPro ANC Headphones', description: 'Active noise cancellation, 40hr battery, premium comfort.', price: 299, discount: 15, discountprice: 254, quantity: 100, ptype: 'Headphones', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&fit=crop'] },
    { name: 'A7 Mirrorless Camera', description: '24.2MP full-frame sensor, 4K video, fast hybrid AF.', price: 1899, discount: 8, discountprice: 1747, quantity: 15, ptype: 'Cameras', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&fit=crop'] },
    { name: 'iPad Air M3', description: '11" Liquid Retina display, M3 chip, all-day battery.', price: 799, discount: 0, discountprice: 0, quantity: 40, ptype: 'Tablets', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&fit=crop'] },
  ],
  'Fashion': [
    { name: 'Slim Fit Blazer', description: 'Premium wool blend, tailored fit, perfect for office.', price: 249, discount: 20, discountprice: 199, quantity: 30, ptype: 'Men', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&fit=crop'] },
    { name: 'Floral Summer Dress', description: 'Lightweight cotton, vibrant floral pattern, knee-length.', price: 89, discount: 0, discountprice: 0, quantity: 60, ptype: 'Women', images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&fit=crop'] },
    { name: 'Kids Hoodie Set', description: 'Soft cotton blend hoodie with matching joggers.', price: 49, discount: 10, discountprice: 44, quantity: 80, ptype: 'Kids', images: ['https://images.unsplash.com/photo-1519238365824-87d0d0d7fc9e?w=500&fit=crop'] },
    { name: 'Leather Crossbody Bag', description: 'Genuine leather, adjustable strap, multiple compartments.', price: 159, discount: 5, discountprice: 151, quantity: 35, ptype: 'Accessories', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&fit=crop'] },
    { name: 'Classic White Sneakers', description: 'Canvas upper, rubber sole, timeless design.', price: 79, discount: 0, discountprice: 0, quantity: 100, ptype: 'Footwear', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&fit=crop'] },
  ],
  'Home & Living': [
    { name: 'Minimalist Desk', description: 'Solid oak wood, modern design, spacious worktop.', price: 449, discount: 12, discountprice: 395, quantity: 10, ptype: 'Furniture', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&fit=crop'] },
    { name: 'Ceramic Vase Set', description: 'Handcrafted set of 3, matte finish, modern aesthetic.', price: 59, discount: 0, discountprice: 0, quantity: 45, ptype: 'Decor', images: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&fit=crop'] },
    { name: 'Premium Chef Knife', description: 'German stainless steel, ergonomic handle, razor sharp.', price: 129, discount: 15, discountprice: 110, quantity: 55, ptype: 'Kitchen', images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&fit=crop'] },
    { name: 'Egyptian Cotton Sheets', description: '1000 thread count, sateen weave, breathable luxury.', price: 199, discount: 10, discountprice: 179, quantity: 40, ptype: 'Bedding', images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&fit=crop'] },
    { name: 'Smart LED Floor Lamp', description: 'Dimmable, color-changing, app-controlled, modern design.', price: 149, discount: 0, discountprice: 0, quantity: 25, ptype: 'Lighting', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&fit=crop'] },
  ],
  'Sports & Fitness': [
    { name: 'Pro Yoga Mat', description: '6mm thick, non-slip, eco-friendly TPE material.', price: 59, discount: 0, discountprice: 0, quantity: 90, ptype: 'Fitness', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&fit=crop'] },
    { name: 'Camping Tent 4P', description: 'Waterproof, 4-person, easy setup, lightweight.', price: 299, discount: 20, discountprice: 239, quantity: 20, ptype: 'Outdoor', images: ['https://images.unsplash.com/photo-1504280390226-e2f2e51922c5?w=500&fit=crop'] },
    { name: 'Football Pro', description: 'FIFA certified size 5, machine-stitched, durable.', price: 39, discount: 0, discountprice: 0, quantity: 120, ptype: 'Team Sports', images: ['https://images.unsplash.com/photo-1518605368461-1ee12523f05f?w=500&fit=crop'] },
    { name: 'Inflatable Standup Paddleboard', description: 'Premium SUP board, pump included, stable design.', price: 499, discount: 10, discountprice: 449, quantity: 8, ptype: 'Water Sports', images: ['https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&fit=crop'] },
    { name: 'Mountain Bike X1', description: '27.5" wheels, 21-speed, disc brakes, lightweight frame.', price: 899, discount: 5, discountprice: 854, quantity: 12, ptype: 'Cycling', images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&fit=crop'] },
  ],
  'Beauty & Health': [
    { name: 'Vitamin C Serum', description: '20% pure vitamin C, hyaluronic acid, brightening formula.', price: 34, discount: 0, discountprice: 0, quantity: 200, ptype: 'Skincare', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&fit=crop'] },
    { name: 'Argan Oil Conditioner', description: 'Sulfate-free, nourishing, for all hair types.', price: 24, discount: 10, discountprice: 22, quantity: 150, ptype: 'Haircare', images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&fit=crop'] },
    { name: 'Matte Lipstick Set', description: 'Set of 6 long-lasting matte shades, cruelty-free.', price: 39, discount: 15, discountprice: 33, quantity: 100, ptype: 'Makeup', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&fit=crop'] },
    { name: 'Blue Seduction Perfume', description: 'Woody oriental fragrance, 100ml, long-lasting.', price: 89, discount: 0, discountprice: 0, quantity: 60, ptype: 'Fragrance', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&fit=crop'] },
    { name: 'Omega-3 Fish Oil', description: '1000mg, 60 softgels, EPA & DHA, heart health.', price: 19, discount: 0, discountprice: 0, quantity: 300, ptype: 'Supplements', images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&fit=crop'] },
  ],
  'Books & Media': [
    { name: 'The Midnight Library', description: 'Bestselling novel about infinite possibilities, hardcover.', price: 24, discount: 0, discountprice: 0, quantity: 500, ptype: 'Fiction', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&fit=crop'] },
    { name: 'Atomic Habits', description: 'Proven way to build good habits and break bad ones.', price: 19, discount: 10, discountprice: 17, quantity: 400, ptype: 'Non-Fiction', images: ['https://images.unsplash.com/photo-1589829085813-8e886f4e7c6c?w=500&fit=crop'] },
    { name: 'Calculus Textbook', description: 'University-level mathematics, comprehensive coverage.', price: 89, discount: 0, discountprice: 0, quantity: 50, ptype: 'Academic', images: ['https://images.unsplash.com/photo-1495446815901-a7297e633511?w=500&fit=crop'] },
    { name: 'Spider-Man Omnibus', description: 'Collects classic Spider-Man comics, hardcover edition.', price: 59, discount: 5, discountprice: 56, quantity: 75, ptype: 'Comics', images: ['https://images.unsplash.com/photo-1566586456038-10b6c7cdcf0e?w=500&fit=crop'] },
    { name: 'Tech Monthly Magazine', description: 'Latest tech news, reviews, and insights, monthly issue.', price: 9, discount: 0, discountprice: 0, quantity: 1000, ptype: 'Magazines', images: ['https://images.unsplash.com/photo-1552820728-8b83bb6b2f2b?w=500&fit=crop'] },
  ],
  'Automotive': [
    { name: 'Dash Cam 4K', description: 'Ultra HD 4K recording, night vision, parking monitor.', price: 149, discount: 10, discountprice: 134, quantity: 80, ptype: 'Car Accessories', images: ['https://images.unsplash.com/photo-1618314912299-33b1c0d30272?w=500&fit=crop'] },
    { name: 'Full Face Helmet', description: 'DOT certified, aerodynamic, anti-fog visor.', price: 199, discount: 0, discountprice: 0, quantity: 40, ptype: 'Bike Gear', images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&fit=crop'] },
    { name: 'Mechanical Tool Kit', description: '200-piece set, chrome vanadium steel, organized case.', price: 129, discount: 15, discountprice: 110, quantity: 35, ptype: 'Tools', images: ['https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&fit=crop'] },
    { name: 'Car Wax Premium', description: 'Ceramic coating, 12-month protection, deep shine.', price: 39, discount: 0, discountprice: 0, quantity: 120, ptype: 'Car Care', images: ['https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&fit=crop'] },
    { name: 'GPS Navigator', description: '6" screen, lifetime maps, real-time traffic, voice control.', price: 249, discount: 20, discountprice: 199, quantity: 25, ptype: 'Navigation', images: ['https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=500&fit=crop'] },
  ],
  'Toys & Games': [
    { name: 'Marvel Action Figure Set', description: 'Set of 6 detailed Marvel characters, 6" scale.', price: 59, discount: 0, discountprice: 0, quantity: 60, ptype: 'Action Figures', images: ['https://images.unsplash.com/photo-1608889825205-e3d14b2e7f39?w=500&fit=crop'] },
    { name: 'Monopoly Classic', description: 'Family board game, 2-8 players, updated edition.', price: 34, discount: 0, discountprice: 0, quantity: 90, ptype: 'Board Games', images: ['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&fit=crop'] },
    { name: '5000-Piece Puzzle', description: 'Panoramic world map, premium quality pieces.', price: 29, discount: 10, discountprice: 26, quantity: 40, ptype: 'Puzzles', images: ['https://images.unsplash.com/photo-1618336753977-1f96d1581cce?w=500&fit=crop'] },
    { name: 'RC Racing Car', description: '1:10 scale, 4WD, 35mph top speed, rechargeable.', price: 89, discount: 5, discountprice: 85, quantity: 30, ptype: 'Remote Control', images: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&fit=crop'] },
    { name: 'STEM Robotics Kit', description: 'Build 12 robots, solar-powered, ages 8+, educational.', price: 49, discount: 0, discountprice: 0, quantity: 55, ptype: 'Educational', images: ['https://images.unsplash.com/photo-1531501410720-c8d437636169?w=500&fit=crop'] },
  ],
  'Groceries': [
    { name: 'Fresh Apple Pack', description: 'Premium-quality apples, 6-pack, farm fresh.', price: 5, discount: 0, discountprice: 0, quantity: 500, ptype: 'Fruits', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&fit=crop'] },
    { name: 'Organic Mixed Greens', description: 'Pre-washed, ready-to-eat salad mix, 300g.', price: 4, discount: 0, discountprice: 0, quantity: 400, ptype: 'Vegetables', images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&fit=crop'] },
    { name: 'Premium Coffee Beans', description: 'Arabica single-origin, medium roast, 500g.', price: 18, discount: 0, discountprice: 0, quantity: 200, ptype: 'Beverages', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&fit=crop'] },
    { name: 'Mixed Nut Bundle', description: 'Almonds, cashews, pistachios mix, 1kg pack.', price: 14, discount: 0, discountprice: 0, quantity: 300, ptype: 'Snacks', images: ['https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&fit=crop'] },
    { name: 'Greek Yogurt Pack', description: 'Creamy, high-protein, 4-pack, plain flavor.', price: 6, discount: 0, discountprice: 0, quantity: 250, ptype: 'Dairy', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&fit=crop'] },
  ],
  'Pet Supplies': [
    { name: 'Premium Dog Food 15kg', description: 'Chicken & rice formula, complete nutrition, all breeds.', price: 49, discount: 0, discountprice: 0, quantity: 100, ptype: 'Dog Food', images: ['https://images.unsplash.com/photo-1565708099684-54b7b5fc82c5?w=500&fit=crop'] },
    { name: 'Gourmet Cat Food 24pk', description: 'Wet food variety pack, grain-free, 24 cans.', price: 39, discount: 5, discountprice: 37, quantity: 80, ptype: 'Cat Food', images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&fit=crop'] },
    { name: 'Squeaky Toy Bundle', description: 'Set of 5 squeaky plush toys, assorted animal designs.', price: 19, discount: 0, discountprice: 0, quantity: 150, ptype: 'Pet Toys', images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&fit=crop'] },
    { name: 'Pet Grooming Kit', description: 'Professional clipper, comb set, nail grinder, scissors.', price: 44, discount: 10, discountprice: 40, quantity: 60, ptype: 'Grooming', images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&fit=crop'] },
    { name: 'Adjustable Dog Leash', description: '4-in-1 reflective leash, hands-free, tangle-free.', price: 24, discount: 0, discountprice: 0, quantity: 120, ptype: 'Accessories', images: ['https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&fit=crop'] },
  ],
};

async function seedProducts() {
  try {
    const uri = process.env.DATABASE;
    if (!uri) {
      throw new Error('DATABASE environment variable is not set');
    }

    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB');

    // Fetch all categories
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories in database`);

    if (categories.length === 0) {
      console.log('❌ No categories found. Please run seed_categories.js first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing products`);

    // Build products with proper catid references
    const allProducts = [];
    
    for (const category of categories) {
      const productTemplates = productsByCategory[category.name];
      if (!productTemplates) {
        console.log(`   ⚠️ No products defined for category: ${category.name}`);
        continue;
      }
      
      for (const template of productTemplates) {
        allProducts.push({
          ...template,
          catid: category._id,
          quantity: template.quantity,
          size: [],
          color: [],
        });
      }
    }

    // Insert all products
    const inserted = await Product.insertMany(allProducts);
    console.log(`✅ Successfully seeded ${inserted.length} products:`);
    
    // Group by category for display
    const grouped = {};
    inserted.forEach(p => {
      const catName = categories.find(c => c._id.toString() === p.catid.toString())?.name || 'Unknown';
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(p.name);
    });

    Object.entries(grouped).forEach(([cat, prods]) => {
      console.log(`   📁 ${cat}: ${prods.length} products`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
}

seedProducts();
