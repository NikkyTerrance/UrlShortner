const express = require ('express');
const mongoose = require ('mongoose');
const shortUrl = require('./models/shortUrl');
const ShortUrl = require ('./models/shortUrl')
const app = express();
require('dotenv').config();





//mongoose
// 'mongodb://localhost/urlShortner'

const dburl = process.env.DB_URL;

mongoose.connect(dburl,{
    useNewUrlParser:true , useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to DB");
}).catch((e)=>{
    console.log("error:", e);
})



//get set
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended:false
}))
app.use('/views', express.static('views'));

app.get('/', async (req,res)=> {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({full: req.body.fullURL})
    res.redirect('/')
})

app.get('/:shortUrl',async (req, res)=> {
  const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
  if (shortUrl == null ) return res.sendStatus(404);

  shortUrl.clicks++
  shortUrl.save();

  res.redirect(shortUrl.full)
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server Started on port: ${PORT} `));
