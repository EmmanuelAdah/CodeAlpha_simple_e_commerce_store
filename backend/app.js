require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { mongoose } = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/authRouter');
const productsRouter = require('./router/productsRouter');
const ordersRouter = require('./router/orderRouter');
const URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  const client = mongoose.connect(URI);

  client.then(() => console.log('Connected to MongoDB...'))
      .catch(err => console.log(err.message));

  // const corsOptions = {
  //     origin: [],
  //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  //     allowedHeaders: ['Content-Type', 'Authorization'],
  //     credentials: true,
  // };
  // app.use(cors(corsOptions));


app.use('/api/auth', authRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
