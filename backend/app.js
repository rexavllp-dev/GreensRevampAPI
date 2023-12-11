import express from 'express';
import cors from 'cors';


const app = express();
const PORT =  5000;
const corsOptions = {
  credentials: true,
  origin: true,
};





app.use(cors(corsOptions));
app.use(express.json());



app.get('/', (req,res) => {
    res.json("Greens_international Server is Online")
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

