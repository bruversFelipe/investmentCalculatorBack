import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const uri = process.env.MONGO_URI;

export default async function connectmongo() {
  let con = mongoose.connect(
    uri,
    {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log('Connected to MongoDB!!!');
    },
  );
  return con;
}
