import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import userRoute from './api/routes/userRoute.js';
import companyRoute from './api/routes/companyRoute.js';
import countryRoute from './api/routes/countryRoute.js';
import adminRoute from './api/routes/adminRoute.js';
import productRoute from './api/routes/productRoute.js';
import brandRoute from './api/routes/brandRoute.js';
import categoryRoutes from './api/routes/categoryRoute.js';
import cartRoutes from './api/routes/cartRoute.js';
import addressRoutes from './api/routes/addressRoute.js';
import saveForLaterRoutes from './api/routes/saveForLaterRoute.js';
import wishlistRoutes from './api/routes/wishlistRoute.js'; 
import orderRoutes from './api/routes/orderRoutes.js';
import paymentRoutes from './api/routes/paymentRoutes.js';
import cancelReasonsRoutes from './api/routes/cancelReasonsRoutes.js';
import cancelOrderRoutes from './api/routes/cancelOrderRoute.js'; 
import couponRoutes from './api/routes/couponRoutes.js';


import session from 'express-session';
import passport from 'passport';
import './api/utils/passport-config.js';
import fileUpload from 'express-fileupload';
import axios from 'axios';
import morgan from 'morgan';

// import createSocketServer from './api/utils/socketIo.js';
// import http from 'http';



dotenv.config();

const app = express();
// const server = http.createServer(app); // Use the createSocketIO function

// const io = createSocketServer(server);
// app.set('socketio', io);

const PORT = 5000;
const corsOptions = {
  credentials: true,
  origin: true,
};

app.use(morgan('combined'))

// set up session
app.use(
  session({
    secret: 'PP1vPtETlCit2f2omXKKQhn1VUC2BSWOEHhYRAqy2W5rgs1Czl1mBPkLIJclwabVzs5HXhIzKYD8ZxlMWy4FNAbrNru8mh07Gr3vxIyDxUcZbnUIoYYcqt1iNldXB7yfbDVsg0n2MDurOXOpDOrFFw3sAwHj7ZHCzUrZEs5wAgGcX9xWQhBx7wTkoWeGW4rZXbx',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from the session

app.use(passport.initialize());
app.use(passport.session());


// middlewares

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/public', express.static('public'));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/country', countryRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/saveforlater', saveForLaterRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/cancelreasons', cancelReasonsRoutes);
app.use('/api/v1/cancelorders', cancelOrderRoutes);
app.use('/api/v1/coupons', couponRoutes);



app.get('/', (req, res) => {
  res.json("Greens_international Server is Online")
});




app.get('/download/:url', async function (req, res) {
  let fileUrl = req.params.url;
  // const fileUrl = 'https://greensecombucket.s3.ap-south-1.amazonaws.com/images/image%20%2819%29.png';

  try {
    // Make a GET request to the external API
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream', // This ensures the response is treated as a stream
    });

    // Set the appropriate headers for the file download
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileUrl)}`);
    // res.setHeader('Content-Type', 'image/png'); // Adjust the Content-Type based on the file type

    // Pipe the response stream to the client response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
