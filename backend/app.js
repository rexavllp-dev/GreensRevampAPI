import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import userRoute from './api/routes/userRoute.js';
import companyRoute from './api/routes/companyRoute.js';
import countryRoute from './api/routes/countryRoute.js';
import knexSessionStore from 'connect-session-knex';
import session from 'express-session';
import db from './config/dbConfig.js';
import passport from './api/middleware/passport-config.js';

const app = express();

const KnexSessionStore = knexSessionStore(session);

const PORT =  5000;
const corsOptions = {
  credentials: true,
  origin: true,
};

dotenv.config()


// middlewares

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({ knex: db }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/v1/users',userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/country',countryRoute);
// app.use('/api/v1/authwithgooglefacebook', )



app.get('/', (req,res) => {
    res.json("Greens_international Server is Online")
});


 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
