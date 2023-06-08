const Admin = require("./models/admin.js");
const User = require("./models/user.js");
const wrapAsync = require("./utils/AsyncError");
const {registrations} = require("./schemas/registrations.js");



module.exports.isLogedIn = async(req,res,next)=>{
    if(!req.isAuthenticated()){
            req.flash('error','sorry you must be authenticated');
            res.redirect('/sign-in')
            }else{
            next()
            }
    }


module.exports.isUser = async(req,res,next)=>{
        const {id1,id2} = req.params;
        const id = await req.user._id.toString();
       
        if(id === id1 ){

                next()

                }else{
                        req.flash('error','sorry you cannot access');
                        res.redirect('/');
                
                }
        }

module.exports.isAdmin = async(req,res,next)=>{
        if(req.isAuthenticated() && req.user.type==="Admin"){               
                next()
            }else{
                req.flash('error','cannot access you must be an admin');
                res.redirect('/')
                }
            
        }


module.exports.isPatient = async(req,res,next)=>{
            if(req.isAuthenticated() && req.user.type==="Patient"){               
                    next()
                }else{
                    req.flash('error','cannot access you must be a Patient');
                    res.redirect('/')
                    }
                
            }


module.exports.initializeAdmin = async(req,res,next)=>{
    const a = await Admin.find();
    console.log(a)
    
    if(a.length===0){
    const user = new User({username:"zinou",email:"m_barkat@estin.dz",type:"Admin"});
        const reguser = await User.register(user,"zinou");
         
        const admin = new Admin({username:"zinou",email:"m_barkat@estin.dz"});
        await admin.save();}
}


module.exports.isLogedOut = async(req,res,next)=>{
        if(req.isAuthenticated()){
                req.flash('error','sorry you are already loged in');
                res.redirect('/')
                }else{
                next()
                }
        }  




module.exports.validateRegistrations = async(req,res,next)=>{
                console.log(req.body)
        const { error } = registrations.validate(req.body);
        
        if (error) {
                console.log(error.details[0].message)
           req.flash("error",error.details[0].message);
           res.redirect("/register")
           
        } else {
            next();
        }
                
                }  



