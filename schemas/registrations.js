const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    medecin: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        ,

    password: Joi.string(),
       

    
    phone:Joi.number().integer(),
    
    
    type:Joi.string(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','dz'] } })
})
module.exports.registrations = schema;
    