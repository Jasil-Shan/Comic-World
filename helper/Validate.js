const userModel = require('../models/usermodel')


let doValidate = (userData)=>{
    console.log(userData)
    return new Promise((resolve, reject) => {
        userModel.findOne({email:userData.email}).then((result)=>{

            console.log(result);
            resolve(result)
        })}
        
    )}

module.exports = doValidate