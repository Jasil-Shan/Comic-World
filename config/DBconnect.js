const mongoose = require('mongoose')

function DBconnect(){
    mongoose.set('strictQuery',false)
    mongoose.connect(process.env.DB_CONFIG).then(result=>{
        console.log('Database connected')
    }).catch((err)=>{
        console.log("data base error \n"+err)
    })

}

module.exports = DBconnect