const express = require("express");
const session = require('express-session');
const path = require('path');
const mongoose = require("mongoose");
const cors = require('cors');
const config = require('config');
const passport = require("passport");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || config.get("PORT");
const mongoUrl = config.get('mongoUri');
// "mongodb+srv://imperoroktov:j1oD4IfIpoDLccZ6@cluster0.pit6ljh.mongodb.net?directConnection=true";
// "mongodb+srv://imperoroktov:SyWhnkRiewVjcaq8@cluster0.jforfs8.mongodb.net/":""

const app = express();
const server = require("http").Server(app);

app.use(bodyParser.json({limit: "100mb"}))
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:100000}))
app.use(cors());
app.get("/",(req,res) => {
    res.redirect("/auth/login")
  })
app.use(express.static(__dirname + '/client/src'));

app.use(session(({
    secret: config.get("JWR_TOKEN"),
    key: "SID",
    cookie: {
      path:"/",
      httpOnly:true,
      maxAge: null
    },
    // store: MongoStore.create({
    //   mongoUrl,
    // }),
    autoRemove : 'interval' ,
    autoRemoveInterval : 120 // Минуты
  })))

  app.use(passport.initialize());
  require("./server/middlewares/passport")(passport);

//AUTH
  require("./server/routes/auth/index.routes").configure(app);

  console.log("!!!!!!!!!!!");
  if(process.env.NODE_ENV === 'default'){
    app.use('/', express.static(path.join(__dirname,'public')))
  
    app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'public/index.html'));
      console.info("public");
    } )
    // require("./server/middlewares/socket.middleware").connect(server, true)
  }
  else{
    // require("./server/middlewares/socket.middleware").connect(server, false)
  }
 async function start(){
    try{
        mongoose.connect(mongoUrl);
        mongoose.connection.on('connected', () => {
          console.info('Mongo connected', {tags: ['mongo']});
        });
        // mongoose.connection.on('reconnected', () => {
        //   console.info('Mongo reconnected', {tags: ['mongo']});
        // });
        // mongoose.connection.on('disconnected', () => {
        //   console.info('Mongo disconnected', {tags: ['mongo']});
        // });
        // mongoose.connection.on('close', () => {
        //   console.info('Mongo closed', {tags: ['mongo']});
        // });
        // mongoose.connection.on('error', (error) => {
        //   console.info(error, {tags: ['mongo']});
        // });
        console.log("AAAAAAAAAAAA")
        server.listen(PORT, () => {
            console.info(`Server started on port: ${PORT}`)
        });
    }catch(err){
        console.error("SERVER EXIT", err)
        process.exit(1);
    }
  }
  start();

  module.exports = app;