import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import userRoute from './api/routes/userRoute.js';
import companyRoute from './api/routes/companyRoute.js';
import countryRoute from './api/routes/countryRoute.js';
import adminRoute from './api/routes/adminRoute.js';
import session from 'express-session';
import passport from 'passport';
import './api/utils/passport-config.js';
import fileUpload from 'express-fileupload';


dotenv.config();

const app = express();



const PORT =  5000;
const corsOptions = {
  credentials: true,
  origin: true,
};

// set up session
app.use(
  session({
    secret: 'secret-key',
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
app.use(fileUpload());
app.use('/public', express.static('public'));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/country', countryRoute);
app.use('/api/v1/admin', adminRoute);


app.get('/', (req,res) => {
    res.json("Greens_international Server is Online")
});


 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
