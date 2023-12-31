import express from 'express';
import cors from 'cors';
import userRoute from './api/routes/userRoute.js';
import companyRoute from './api/routes/companyRoute.js';
import countryRoute from './api/routes/countryRoute.js';
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT =  5000;
const corsOptions = {
  credentials: true,
  origin: true,
};



// middlewares

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/v1/users',userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/country',countryRoute);



app.get('/', (req,res) => {
    res.json("Greens_international Server is Online")
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
