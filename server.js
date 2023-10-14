const express = require ('express');
const mongoose = require ('mongoose');
const shortUrl = require('./models/shortUrl');
const ShortUrl = require ('./models/shortUrl')
const app = express();




//mongoose
// 'mongodb://localhost/urlShortner'
const dbUrl = "mongodb+srv://nikkydocode:KQIisXEcby5jDFRS@cluster0.pgttnew.mongodb.net/";

mongoose.connect(dbUrl,{
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

app.listen(process.env.PORT || 5000);
