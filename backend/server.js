const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

/* ================= DB CONNECT ================= */
mongoose.connect("mongodb+srv://admin:admin123@cluster0.8s9gtxk.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= MIDDLEWARE ================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= MODELS ================= */
const User = require('./models/User');

const Product = mongoose.model('Product', {
    name: String,
    price: Number,
    image: String
});

/* ================= ROUTES ================= */

app.get('/', (req, res) => {
    res.render('index');
});

/* REGISTER */
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.send("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });

    await user.save();

    res.send("User Registered Successfully");
});

/* LOGIN */
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.send("Invalid Password");
    }

    res.redirect('/dashboard');
});

/* DASHBOARD */
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

/* LOGOUT */
app.get('/logout', (req, res) => {
    res.redirect('/');
});

/* ADD PRODUCT */
app.post('/add-product', async (req, res) => {
    const { name, price, image } = req.body;

    const product = new Product({ name, price, image });

    await product.save();

    res.redirect('/products');
});

/* SHOW PRODUCTS */
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

/* API */
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

/* SERVER START */
app.listen(3000, () => {
    console.log("Server Started on Port 3000");
});