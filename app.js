const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/AsyncError");
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const fs = require("fs");
const passport = require('passport');
const passportLocal = require('passport-local');
const app = express();
const Patient = require("./models/patient.js");
const Medecin = require("./models/medecin.js");
const Message = require("./models/message.js");
const Publication = require("./models/publication.js");
const Admin = require("./models/admin.js");
const User = require("./models/user.js");
const Result = require("./models/result.js");
const Reservation = require("./models/reservation.js");
const Recrutement = require("./models/recrutement.js");
const FeedBack = require("./models/feedBack.js");
const {isLogedIn,isLogedOut,isAdmin,isPatient,initializeAdmin,validateRegistrations,isUser} = require("./middleware");
const fileUpload = require('express-fileupload');
const request = require("request");
const cors = require('cors') 




mongoose.connect("mongodb://0.0.0.0:27017/sinalab",{useNewUrlParser:true},{useCreateIndex:true},{useUnifiedTopoligy:true})
.then(()=>{console.log("yes we did it")})
.catch(err=>{console.log(err)});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.static(path.join(__dirname,'/publications')));
app.use(express.static(path.join(__dirname,'/users')));
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(methodOverride('_method'));

const sessionConfig = {
    
    name: 'session',
    secret:"helloooooooo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(fileUpload());

/***************************************************************************************************************************************/
/***************************************************************************************************************************************/

initializeAdmin();
    
        

/***************************************************************************************************************************************/
app.listen(8000,()=>{

    console.log("we are listening to port 8000 YAHOOOOOOO")
});





//HOME

app.get("/",isLogedIn,wrapAsync(async(req,res)=>{
    
   if(req.user.type==="Patient"){
    const theUser = await Patient.findOne({username:req.user.username})
    res.render("home",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }else if(req.user.type==="Medecin"){
        const theUser = await Medecin.findOne({username:req.user.username})
        res.render("home",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }else if(req.user.type==="Admin"){
        const theUser = await Admin.findOne({username:req.user.username})
        res.render("home",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }
    
}))



//sign in

app.get("/sign-in",isLogedOut,wrapAsync(async(req,res)=>{   
    res.render("sign-in",{success:req.flash('success'),error:req.flash("error")});
}))




//Register

app.get("/register",isAdmin,wrapAsync(async(req,res)=>{  
   
    res.render("register",{user:req.user,success:req.flash('success'),error:req.flash("error")});
    
    
       
    
}))




app.get("/updatePassword",isLogedIn,wrapAsync(async(req,res)=>{  
   

    if(req.user.type === "Patient"){
        const theUser = await Patient.findOne({username:req.user.username})
        res.render("updatePassword",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }else if(req.user.type === "Medecin"){
        const theUser = await Medecin.findOne({username:req.user.username})
        res.render("updatePassword",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})

    }else if(req.user.type === "Admin"){
        const theUser = await Admin.findOne({username:req.user.username})
        res.render("updatePassword",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})

    }

 
}))

app.get("/updateProfile",isLogedIn,wrapAsync(async(req,res)=>{  
   
    if(req.user.type === "Patient"){
    const theUser = await Patient.findOne({username:req.user.username})
    res.render("updateProfile",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }else if(req.user.type === "Medecin"){
        const theUser = await Medecin.findOne({username:req.user.username})
        res.render("updateProfile",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})

    }else if(req.user.type === "Admin"){
        const theUser = await Admin.findOne({username:req.user.username})
        res.render("updateProfile",{user:req.user,theUser,success:req.flash('success'),error:req.flash("error")})
    }


}))




//logout

app.get("/logout",async(req, res, next)=>{
   req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success","GOODBY");
      res.redirect('/sign-in');
    })})



//Results

app.get("/send-result",isAdmin,wrapAsync(async(req,res)=>{
    
    res.render('send-result',{user:req.user,success:req.flash('success'),error:req.flash("error")})

}))



app.get("/results",isPatient,wrapAsync(async(req,res)=>{

    const patient = await Patient.findOne({username:req.user.username}).populate("results");
    res.render('results',{user:req.user,success:req.flash('success'),error:req.flash("error"),patient:patient});

}))



app.get("/results/:id",isLogedIn,wrapAsync(async(req,res)=>{
    
    const {id} = req.params;
    const result = await Result.findOne({_id:id}).populate("owner");
    if(req.user.type === "Patient"){
       
        if(req.user.username === result.owner.username){
            res.sendFile(result.path)
        }else{
            req.flash("error","access denied");
            res.redirect("/")
        }
    }else{
        res.sendFile(result.path)
    }
 

     
    
    

}))


//patient

app.get("/patients",isLogedIn,wrapAsync(async(req,res)=>{
    if(req.user.type === "Admin"){
    const patients = await Patient.find({});
    res.render("patients",{user:req.user,patients}) 
}else if(req.user.type === "Medecin"){
        const medecin = await Medecin.findOne({username:req.user.username});
        const patients = await Patient.find({medecins:medecin});
        res.render("patients",{user:req.user,patients})

    }  else{
        req.flash("error","access denied");
        res.redirect("/")
    }

}))

app.get("/patients/:id",isLogedIn,wrapAsync(async(req,res)=>{

    const {id} = req.params;
    const patient = await Patient.findOne({_id:id}).populate("medecins").populate("results");
   
    if(req.user.type === "Admin" || "Medecin"){ 
    
    res.render("patient",{user:req.user,patient}) 

}else{
        req.flash("error","access denied");
        res.redirect("/")
    }

}))

//Medecin

app.get("/medecins/:id",isAdmin,wrapAsync(async(req,res)=>{

    const {id} = req.params;
    const medecin = await Medecin.findOne({_id:id}).populate("patients");
 
    res.render("medecin",{user:req.user,medecin}) 
    

}))

app.get("/medecins",isAdmin,wrapAsync(async(req,res)=>{

    
    const medecins = await Medecin.find({}).populate("patients");
 
    res.render("medecins",{user:req.user,medecins}) 
    

}))



//CHAT

app.get("/chatList",isLogedIn,wrapAsync(async(req,res)=>{
    if (req.user.type === "Admin"){
        const medecins = await User.find({type:"Medecin"})
        const patients = await User.find({type:"Patient"})
        res.render("chatList",{theUser:req.user,medecins,patients,user:req.user})}
        /************************************************************************************ */
    else if(req.user.type === "Medecin"){
      
        const med = await Medecin.findOne({username:req.user.username}).populate("patients");
        const pats = await Patient.find({medecins:med});
        
        var usernames = []
        for(let pat of pats ){
            usernames.push(pat.username)
        }
        const patients = await User.find({username:{$in:usernames}});
        const admins = await User.find({type:"Admin"});
        
        res.render("chatList",{theUser:req.user,patients,admins,user:req.user})
        /***************************************************************************** */
    } else if(req.user.type === "Patient"){
        const patient = await Patient.findOne({username:req.user.username}).populate("medecins");
        const med = await Medecin.find({patients:patient});
        console.log("med:",med)
        var usernames = []
        for(let medecin of med ){
            usernames.push(medecin.username)
        }
        const medecins = await User.find({username:{$in:usernames}});
        console.log("medecins:",medecins)



        const admins = await User.find({type:"Admin"});
        res.render("chatList",{theUser:req.user,admins,medecins,user:req.user})
    }
    
    //if (req.user.type === "Admin"){
   
   // }else if(req.user.type === "Medecin"){
        //res.render("chatList",{theUser:req.user,users:patients})

    //}else if(req.user.type === "Patient"){
      //  res.render("chatList",{theUser:req.user,users:[...medecins,...admins]})

    //}
    
    
    

}))

app.get("/chatList/:id1/:id2", isLogedIn, wrapAsync(async (req, res, next) => {
    const { id1, id2 } = req.params;
    const owner = await User.findOne({ _id: id1 });
    const to = await User.findOne({ _id: id2 });
    var messages = await Message.find({ owner: { $in: [owner, to] }, to: { $in: [owner, to] } })
      .populate("owner")
      .populate("to");

      console.log("messages",messages)
    
  
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    res.render("chat", { me:req.user,messages, id1, id2, owner, to, months,user:req.user });
  }));
  



//Recrutement

app.get("/recrutement",isAdmin,wrapAsync(async(req,res)=>{

    const recru = await Recrutement.find({});  
    res.render('recrutement',{user:req.user,success:req.flash('success'),error:req.flash("error"),recrutements:recru});

}))



app.get("/recrutement/cv/:id",isAdmin,wrapAsync(async(req,res)=>{

    const {id} = req.params;
    const recru = await Recrutement.findOne({_id:id});
    res.sendFile(recru.cv)
     
}))
app.get("/recrutement/ldm/:id",isAdmin,wrapAsync(async(req,res)=>{

    const {id} = req.params;
    const recru = await Recrutement.findOne({_id:id});
    res.sendFile(recru.ldm)
     
}))



app.get("/Publication",isAdmin,wrapAsync(async(req,res)=>{

    res.render("Publication",{user:req.user,success:req.flash('success'),error:req.flash("error")})
     
}))

app.get("/api-pub",wrapAsync(async(req,res)=>{
    console.log("pub");
    const {id} =req.query; 
    if(!id){
    const publications = await Publication.find({})
    res.json(publications)

    }else{

        const publication = await Publication.findOne({_id:id})
        res.json(publication)

    }

}))

app.get("/api-medecins",wrapAsync(async(req,res)=>{
   
   
    const medecins = await Medecin.find({})
    console.log(medecins)
    res.json(medecins)

   

}))

app.get("/api-patients",wrapAsync(async(req,res)=>{
   
   
    const patients = await Patient.find({})
    res.json(patients)

   

}))
app.get("/api-users",isLogedIn,wrapAsync(async(req,res)=>{
   
   
    const users = await User.find({})
    res.json(users)

   

}))

app.get("/api-pub/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const publication = await Publication.findOne({_id:id})
    res.json(publication);

}))




  app.get("/stats",isAdmin,wrapAsync(async(req,res)=>{
    console.log(req.query);
    const {type} = req.query;
    console.log(type);
   
    res.render("stats",{type,user:req.user})

  }))


  app.get("/reservations",isAdmin,wrapAsync(async(req,res)=>{
   
   const reservations = await Reservation.find({});
    res.render("reservations",{reservations,user:req.user})

  }))

  app.get("/feedBack",isAdmin,wrapAsync(async(req,res)=>{
   
    const feeds = await FeedBack.find({});
     res.render("feedBack",{feeds,user:req.user,success:req.flash('success'),error:req.flash("error")})
 
   }))






    
/*****************************************************POOOOOOOOOOOOOOOOST**********************************************************************/

app.post("/reservation",wrapAsync(async(req,res)=>{
    
    const {name,phone,adresse,email} = req.body;
    console.log(req.body)
    
   const reservation = new Reservation({name,phone,adresse,email})
    reservation.save()
    res.redirect("http://localhost:3000")

  }))






app.post("/stats/ab",wrapAsync(async(req,res)=>{
    if(req.files){ 
        file=req.files.csv;
        const filePath = path.join(__dirname,"public","csv","Classeur2.csv");
        
      
        file.mv(filePath,function(err){
            if(err){
                req.flash("error",err.name);
                res.redirect("/stats");
            }else{
                req.flash("success","csv apply");
                res.redirect("/stats?type=one");
            }
        })

    }else{

       
       
                res.redirect("/stats?type=one");

    }
  }))


  
app.post("/stats/ac",wrapAsync(async(req,res)=>{
    if(req.files){ 
        file=req.files.csv;
        const filePath = path.join(__dirname,"public","csv","ac.csv");
        file.mv(filePath,function(err){
            if(err){
                req.flash("error",err.name);
                res.redirect("/stats");
            }else{
                req.flash("success","csv apply");
                res.redirect("/stats?type=two");
            }
        })

    }else{  
                res.redirect("/stats?type=two");
 }
  }))


   
app.post("/stats/as",wrapAsync(async(req,res)=>{
    if(req.files){ 
        file=req.files.csv;
        const filePath = path.join(__dirname,"public","csv","as.csv");
        file.mv(filePath,function(err){
            if(err){
                req.flash("error",err.name);
                res.redirect("/stats");
            }else{
                req.flash("success","csv apply");
                res.redirect("/stats?type=three");
            }
        })

    }else{

         res.redirect("/stats?type=three");

    }
  }))






app.post("/stats",wrapAsync(async(req,res)=>{
    const {type} = req.body;
    res.redirect(`stats?type=${type}`)
  }))



app.post("/publications",isAdmin,wrapAsync(async(req,res)=>{
     
        const {title,content,description} = req.body;
        console.log(req.body)
    if(req.files){ 
        file=req.files.img;
        const filePath = path.join(__dirname,"publications",title +"-"+ file.name);
        const Path =  path.join("localhost:8000",title +"-"+file.name)
        const publi = new Publication({title,img:Path,content,description,path:filePath})
        publi.save();
        file.mv(filePath,function(err){
            if(err){
                req.flash("error",err.name);
                res.redirect("/Publication");
            }else{
                req.flash("success","publication envoyee");
                res.redirect("/Publication");
            }
        })

    }else{

        const publi = new Publication({title,content,description});
        publi.save();
        req.flash("success","publication envoyee");
                res.redirect("/Publication");

    }
        
          }
    
))


app.post("/register",isAdmin,wrapAsync(async(req,res,next)=>{
   
   const {username,email,password,type,phone,medecin} = req.body;
 
 const exist1 = await User.findOne({username})
 const exist2 = await User.findOne({email})
 if(exist1 || exist2){
    
    req.flash("error","username or email already existe");
    res.redirect("/register")
    next()

    
 }else{
 const user = new User({username,email,type})
    
    const reguser = await User.register(user,password);     
    const medecinAsso = await Medecin.findOne({username:medecin});
        
 switch(reguser.type) {
    case "Admin":
       
        const admin = new Admin({username,email,phone});
        await admin.save(); 
        req.flash('success','registration done');
        res.redirect("/");
      break;
    case "Patient":
        const patient = new Patient({username,email,phone});
        if(medecinAsso){
        patient.medecins.push(medecinAsso)
        medecinAsso.patients.push(patient)}
       await patient.save();
      
       await medecinAsso.save();
        req.flash('success','registration done');
        res.redirect("/");
      break;
    case "Medecin":
        const medecin = new Medecin({username,email,phone});
        await medecin.save();
        req.flash('success','registration done');
        res.redirect("/");
        
      break;
    default:
        req.flash('error','type doesnt existe');    
  }  }
   }))



app.post("/updateProfile",isLogedIn,wrapAsync(async(req,res,next)=>{
   
  const {email,phone,medecin} = req.body;
  var photo = "/homeperson.svg"

  if(req.files){  
    file=req.files.photo;
    filePath = path.join(__dirname,"users",req.user.username+".jpg");
    photo = `/${req.user.username}.jpg`
    const user = await User.findOneAndUpdate({username:req.user.username},{email,photo});    
         await user.save();
 
    file.mv(filePath,function(err){
        if(err){
            req.flash("error",err.name);
            res.redirect("/updateProfile");
        }
    })}else{
        filePath = path.join(__dirname,"users",req.user.username+".jpg");
        photo = `/${req.user.username}.jpg`
        const user = await User.findOneAndUpdate({username:req.user.username},{email,photo});    
         await user.save();

    }


  
   
  
         
     const medecinAsso = await Medecin.findOne({username:medecin});
         
         
 
  switch(req.user.type) {
     case "Admin":
         console.log(photo)
         const admin = await Admin.findOneAndUpdate({username:req.user.username},{email,phone,photo});
         
         await admin.save(); 
         req.flash('success','update done');
         res.redirect("/");
       break;
     case "Patient":
        console.log(filePath)
        const patient = await Patient.findOneAndUpdate({username:req.user.username},{email,phone,photo});
        
        if(medecinAsso){
        patient.medecins.push(medecinAsso)
        await patient.save();
        medecinAsso.patients.push(patient)
        await medecinAsso.save();
        req.flash('success','update done');
         res.redirect("/");

        }else{
           
            req.flash("error","Le medecin associée n'existe pas");
            res.redirect("/updateProfile");
           
        }
       
         
       break;
     case "Medecin":
         const medecin = await Medecin.findOneAndUpdate({username:req.user.username},{phone,email,photo});
         await medecin.save();
         req.flash('success','update done');
         res.redirect("/");
         
       break;
     default:
         req.flash('error','type doesnt existe');    
   }  }
    ))


app.post("/updatePassword",wrapAsync(async(req,res)=>{

    const {newPassword,confirmPassword} = req.body;
    if(newPassword === confirmPassword){
    const user = await User.findOne({username:req.user.username})
     
         await user.setPassword(confirmPassword)
         await user.save()
         req.flash("success","password updated ")
         res.redirect("/")
        }else{

            req.flash("error","you must confirm your password correctly")
            res.redirect("/updatePassword")

        }
}))
 


app.post("/sign-in",passport.authenticate('local',{failureFlash:true,failureRedirect:'/sign-in'}),wrapAsync(async(req,res)=>{
       
       req.flash("success","welcome back");     
       res.redirect("/");
   }))



app.post("/send-result",isAdmin,wrapAsync(async(req,res)=>{

    if(req.files){
    file=req.files.result;
    const {username,title} = req.body;
    const filePath = path.join(__dirname,"results",file.name);
    const patient = await Patient.findOne({username:username});

   if(!patient){
    req.flash("error",'patient existe pas');
    res.redirect("/send-result")
   }
    
    const result = new Result({name:file.name,path:filePath})
    patient.results.push(result);
    patient.save();
    result.owner = patient;
    console.log(result)
    result.save();
    file.mv(filePath,function(err){
        if(err){
            req.flash("error",err.name);
            res.redirect("/send-result");
        }else{
            req.flash("success","file uploaded");
            res.redirect("/send-result");
        }
    })}else{
        req.flash("error","you need to select a file");
        res.redirect("/send-result");
    }
  
}))


app.post("/results/:id",isLogedIn,wrapAsync(async(req,res)=>{
    if(req.user.type ==="Patient"){
        const {id} = req.params;
        const the_result = await Result.findOne({_id:id}).populate("owner");
        console.log("user :",req.user)
        console.log("result :",the_result)
        if(req.user.username === the_result.owner.username ){
            const {id} = req.params;
            const result = await Result.findOne({_id:id});
            res.download(result.path)
          }else{
            req.flash("error",'access denied')
            res.redirect("/")
          }}else{
            const {id} = req.params;
            const result = await Result.findOne({_id:id});
            res.download(result.path)

          }
          }
    
))


app.post("/recrutement/cv/:id",isAdmin,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const recru = await Recrutement.findOne({_id:id});
    res.download(recru.cv)

}))

app.post("/recrutement/ldm/:id",isAdmin,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const recru = await Recrutement.findOne({_id:id});
    res.download(recru.ldm)
    

}))

app.post("/chatList/:id1/:id2",isLogedIn,isUser,wrapAsync(async(req,res)=>{
    const {message} = req.body;
    const {id1,id2} = req.params;
    const owner = await User.findOne({_id:id1});
    const to = await User.findOne({_id:id2});
    const msg = new Message({content:message,owner,to});

    msg.save()
    res.redirect(`/chatList/${id1}/${id2}`);
    
}))




app.post("/recrutement",wrapAsync(async(req,res,next)=>{


    cvfile=req.files.cv;
    ldmfile=req.files.ldm;
    console.log(cvfile)
    console.log(ldmfile)
    
    const {name,profession} = req.body;
    const cvPath = path.join(__dirname,"recrutements","cv",name+"-"+cvfile.name);
    const ldmPath = path.join(__dirname,"recrutements","ldm",name+"-"+ldmfile.name);
    
    
    const recru = new Recrutement({name:name,cv:cvPath,ldm:ldmPath,profession})
    
    recru.save();
    cvfile.mv(cvPath,function(err){
        if(err){
            req.flash("error",err.name);
            res.redirect("http://localhost:3000")
        }else{
            console.log("done 1")
        }
    })
    ldmfile.mv(ldmPath,function(err){
        if(err){
            req.flash("error",err.name);
            res.redirect("http://localhost:3000")
        }else{
            console.log("done 2")
            req.flash("success","file uploaded");
            res.redirect("http://localhost:3000")
        }
    })
   

}))

app.post("/feedBack",wrapAsync(async(req,res,next)=>{


   
    
    const {name,email,message} = req.body;
   
    
    
    const feed = new FeedBack({name:name,email,message})
    
    feed.save();
    res.redirect("http://localhost:3000")
  
   

}))


/******************************************************************************************************************* */

app.delete("/results/:id",isLogedIn,wrapAsync(async(req,res)=>{
    if(req.user.type === "Medecin"){
        req.flash("error",'access denied')
        res.redirect("/")
    }else if(req.user.type ==="Patient"){
    const {id} = req.params;
    const the_result = await Result.findOne({_id:id}).populate("owner");
    if(req.user.username === the_result.owner.username ){
     await Result.deleteOne({_id:id});
    fs.unlink(the_result.path, function (err) {
        if (err) {req.flash("error",err.name)}else{
        req.flash("success",'File deleted!');}
        res.redirect(`/results`)
      })}
      else{
        req.flash("error",'access denied')
        res.redirect("/")
      }}else if(req.user.type==="Admin"){

        const {id} = req.params;
        const the_result = await Result.findOne({_id:id}).populate("owner");
        
        await Result.deleteOne({_id:id});
        fs.unlink(the_result.path, function (err) {
        if (err) {req.flash("error",err.name)}else{
        req.flash("success",'File deleted!');}
        res.redirect(`/patients`)
      })}

      
    })
)

app.delete("/recrutement/:id",isAdmin,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const recru = await Recrutement.findOne({_id:id});
     await Recrutement.deleteOne({_id:id});
    fs.unlink(recru.cv, function (err) {
        if (err) {req.flash("error",err.name)}else{
        req.flash("success",'File deleted!');}
        res.redirect(`/recrutement`)
      });
    

}))

app.delete("/reservations/:id",isAdmin,wrapAsync(async(req,res)=>{
    const {id} = req.params;
   
     await Reservation.deleteOne({_id:id});
     req.flash("success","reservation deleted")
     res.redirect("/reservations")
   
    

}))

app.delete("/feedBack/:id",isAdmin,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const feed = await FeedBack.findOne({_id:id});
     await FeedBack.deleteOne({_id:id});
     res.redirect("/feedBack")
  
    

}))

app.delete("/Publications",isAdmin,wrapAsync(async(req,res,next)=>{
    const {title} = req.body;
    console.log(title)
    try{const publi = await Publication.findOne({title})}catch{
        console.log("in catch")
        req.flash("error","publication not found");
        res.redirect("/publication");
        next()
    }
    console.log(publi)
     await Publication.deleteOne({title});
     if(publi.img!=='localhost:8000\\default.jpg'){
    fs.unlink(publi.path, function (err) {
        if (err) {req.flash("error",err.name)}else{
        req.flash("success",'publication deleted!');}
        res.redirect(`/Publication`)
      })}else{
        req.flash("success",'publication deleted!')
        res.redirect(`/Publication`)
      }
    

}))
 

app.delete("/patients/:id",isLogedIn,wrapAsync(async(req,res,next)=>{
    console.log(0)
    if(req.user.type==="Admin"){
    const {id} = req.params;
    const patient = await Patient.findOne({_id:id}).populate("results");
     await Patient.deleteOne({_id:id});
     await User.deleteOne({username:patient.username})
     fs.unlink(`./users/${patient.photo}`, function (err) {
        if (err) {req.flash("error",err.name)}
      });
     req.flash("success","patient deleted successfuly")

        res.redirect(`/patients`);
        

    }else if(req.user.type==="Medecin"){
        console.log(1)

        const {id} = req.params;
        console.log(1)
        const medecin = await Medecin.findOne({username:req.user.username}).populate("patients")
        
        const patient = await Patient.findOne({_id:id}).populate("medecins");
        

        const newmed = medecin.patients.filter((pat) =>{
            console.log("pat:",pat.username,"patient:",patient.username)

            if(pat.username !== patient.username){

                return(pat)
            }
        })
        console.log(newmed)
        const newpat = patient.medecins.filter((med) =>{
            if(med.username !== medecin.username){

                return(med)
            }
        })
        console.log(5)

        medecin.patients = newmed
        patient.medecins = newpat

        medecin.save();
        console.log(6)
        patient.save()
        console.log(7)

    req.flash("success","patient deleted successfuly")
    res.redirect(`/patients`);
   

        }else{

        req.flash("error","sorry access denied")
    res.redirect(`/`);}

}))

app.delete("/medecins/:id",isAdmin,wrapAsync(async(req,res)=>{

    const {id} = req.params;
    const medecin = await Medecin.findOne({_id:id})
     await Medecin.deleteOne({_id:id});
     await User.deleteOne({username:medecin.username});
     fs.unlink(`./users/${medecin.photo}`, function (err) {
        if (err) {req.flash("error",err.name)}
      });
     req.flash("success","medecin deleted")
     res.redirect("/medecins")

}))


app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500); 
    req.flash("error",err.name)
    res.redirect("/");
    
})


app.use(isLogedIn,(req,res,next)=>{
    res.render("error",{user:req.user})
    
})






