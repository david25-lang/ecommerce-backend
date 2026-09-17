const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/product");

const products = [
  {
    name: "Classic White Sneakers",
    price: 59.99,
    image: "https://picsum.photos/seed/sneakers/400/400",
    description: "Comfortable everyday sneakers with a clean, minimal look.",
    category: "Footwear",
  },
  {
    name: "Leather Backpack",
    price: 89.99,
    image: "https://picsum.photos/seed/backpack/400/400",
    description: "Durable leather backpack with laptop compartment.",
    category: "Bags",
  },
  {
    name: "Wireless Headphones",
    price: 129.99,
    image: "https://picsum.photos/seed/headphones/400/400",
    description: "Noise-cancelling over-ear headphones with 30hr battery life.",
    category: "Electronics",
  },
  {
    name: "Denim Jacket",
    price: 74.99,
    image: "https://picsum.photos/seed/jacket/400/400",
    description: "Vintage-wash denim jacket, unisex fit.",
    category: "Clothing",
  },
  {
    name: "Ceramic Coffee Mug",
    price: 14.99,
    image: "https://picsum.photos/seed/mug/400/400",
    description: "Hand-glazed ceramic mug, holds 12oz.",
    category: "Home",
  },
  {
    name: "Smartwatch",
    price: 199.99,
    image: "https://picsum.photos/seed/watch/400/400",
    description: "Track fitness, notifications, and more.",
    category: "Electronics",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Product.deleteMany();
    console.log("Existing products cleared");

    await Product.insertMany(products);
    console.log("Products seeded successfully");

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedDatabase();