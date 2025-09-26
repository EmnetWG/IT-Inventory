
//require('express-async-errors')
try {
  require('dotenv').config();
// console.log(" ENV Loaded:", process.env.SESSION_SECRET);
const express = require('express');
// console.log(" Express initialized")
const bodyParser = require('body-parser');
const session = require('express-session');
const sanitizeInput = require('./middlewares/sanitizeInput');
const path = require('path');
const app = express();

const helmet = require('helmet')
const cors = require('cors')
//const xss =require('xss-clean')
const cookieParser = require('cookie-parser')
const rateLimiter = require('express-rate-limit')

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.contentSecurityPolicy({
  directives:{
    defaultSrc:["'self'"],
    scriptSrc:["'self'", "https://cdn.jsdelivr.net"],
    styleSrc:["'self'",  "https://cdn.jsdelivr.net"],
    fontSrc:["'self'", "https://cdn.jsdelivr.net"],
  },
}))

// console.log(" Middleware loaded");
app.use(cors())
//app.use(xss())
app.use(cookieParser(process.env.SESSION_SECRET))

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs:15*60*1000,
  max:500,
}))

const { sequelize } = require('./models/Index');
// console.log(" Sequelize loaded");
app.use(sanitizeInput);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
  }
}));

// console.log(" Session secret:", process.env.SESSION_SECRET.length);

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const itemTypeRoutes = require('./routes/itemTypesRoutes');
const userRoutes = require('./routes/userRoutes');



// Middleware
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', itemRoutes);
app.use('/api', itemTypeRoutes);
app.use('/api', userRoutes);

// console.log(" Routes loaded")

// Serve the HTML view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)
// Start server and sync DB
//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 1060;
// console.log(" Attempting to connect DB..."); 
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });


}).catch (err=> {
  console.error(" Sequelize failed to sync:", err);

})


}
 catch (err) {
  console.error(" Server failed to start:", err);
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1); // optional: force exit
});