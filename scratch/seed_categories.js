import mongoose from 'mongoose';
import dns from 'dns';
import '../Config/env.js';
import Category from '../Models/categoriesschema.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const categories = [
  {
    name: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&fit=crop',
    subcategories: ['Laptops', 'Mobiles', 'Headphones', 'Cameras', 'Tablets']
  },
  {
    name: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&fit=crop',
    subcategories: ['Men', 'Women', 'Kids', 'Accessories', 'Footwear']
  },
  {
    name: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&fit=crop',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting']
  },
  {
    name: 'Sports & Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&fit=crop',
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Cycling']
  },
  {
    name: 'Beauty & Health',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&fit=crop',
    subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Supplements']
  },
  {
    name: 'Books & Media',
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633511?w=1200&fit=crop',
    subcategories: ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Magazines']
  },
  {
    name: 'Automotive',
    imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&fit=crop',
    subcategories: ['Car Accessories', 'Bike Gear', 'Tools', 'Car Care', 'Navigation']
  },
  {
    name: 'Toys & Games',
    imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&fit=crop',
    subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Remote Control', 'Educational']
  },
  {
    name: 'Groceries',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&fit=crop',
    subcategories: ['Fruits', 'Vegetables', 'Beverages', 'Snacks', 'Dairy']
  },
  {
    name: 'Pet Supplies',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&fit=crop',
    subcategories: ['Dog Food', 'Cat Food', 'Pet Toys', 'Grooming', 'Accessories']
  }
];

async function seedCategories() {
  try {
    const uri = process.env.DATABASE;
    if (!uri) {
      throw new Error('DATABASE environment variable is not set');
    }

    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 });
    console.log('Connected to MongoDB');

    // Clear existing categories
    const deleted = await Category.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing categories`);

    // Insert new categories
    const inserted = await Category.insertMany(categories);
    console.log(`✅ Successfully seeded ${inserted.length} categories:`);
    inserted.forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.name} (${cat.subcategories.length} subcategories)`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    process.exit(1);
  }
}

seedCategories();
