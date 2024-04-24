exports.getCities = (callback)=>{
    let context  = "api to get all cities"
    const query = `select * from cities`;
    dbutil.execQuery(dbconnection,query,context,(err,rows)=>{
        if(err){
            return callback(err)
        }
        else{
            return callback(null,rows)
        }
    })
}

exports.enterNewCity =(cityId,cityName,years,callback)=>{
    let contextEnterCity = "api to create new cities in the db"
    const insertQuery = `insert into cities(cityId,cityName,years) values(?,?,?)`;
    let contextCheckCity = "check if city is there"
    const getQuery = "select * from cities where cityId= ?";
    dbutil.execQuery(dbconnection,getQuery,contextCheckCity,[cityId],(err,rows)=>{
        if(err){
            return callback(err)
        }
        const citycheck = rows[0]
        if(citycheck){
            return callback(null,{message : "City already Existed",code : 409})
        }
        else{
            dbutil.execQuery(dbconnection,insertQuery,contextEnterCity,[cityId,cityName,years],(err,rows)=>{
                if(err){
                    return callback(err)
                }
                else{
                    return callback(null,{message : `City Inserted successfully to db with id ${cityId}`})
                }
        })
    }

    })
}