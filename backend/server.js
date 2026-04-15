const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/product");

dotenv.config();

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
        {
          name: "Sample Laptop",
          price: 49999,
          description: "A fast laptop for daily tasks.",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Smartphone",
          price: 19999,
          description: "A smartphone with a great camera.",
          image:
            "https://th.bing.com/th/id/OIP.vJA54HhkzjygE59DhOeiXQHaFR?w=223&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
        },
        {
          name: "Wireless Headphones",
          price: 2999,
          description: "Comfortable Bluetooth headphones.",
          image:
            "https://th.bing.com/th/id/OIP.iGFJ7i0DUqTCdgcDIoxo3QHaHa?w=176&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
        }
    ]);
  }
};

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedProducts();
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
};

startServer();