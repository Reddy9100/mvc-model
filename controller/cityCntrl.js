const cityMdl = require("../model/cityMdl")

exports.getAllCities = (req,res)=>{
    cityMdl.getCities((err,results)=>{
        if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        else{
            return res.status(200).json({message : results})
        }
    })
}

exports.cityEntry = (req,res)=>{
    const{cityId ,cityName,years} = req.body
    cityMdl.enterNewCity(cityId,cityName,years,(err,results)=>{
        if(err){
           return res.status(500).json({message : "Internal server error"})
        }
        if(results.code === 409){   

            return res.status(409).json({message : results.message})

        }        
    })
}