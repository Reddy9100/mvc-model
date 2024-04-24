exports.execQuery = function (ConPool, Qry,context,values, callback) {
    if (callback && typeof callback === "function") {
        // console.log(ConPool)
        ConPool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error getting connection from pool:", err);
                callback(err, null);
                return;
            }
            console.log("Database connection established.");
            connection.query(Qry, values, function (err, rows) {
                connection.release();
                if (err) {
                    console.error("Error executing query:", err);
                    callback(err, null);
                    return;
                }
                callback(false, rows);
            });
        });
    } else {
        return new Promise(function (resolve, reject) {
            ConPool.getConnection(function (err, connection) {
                if (err) {
                    console.error("Error getting connection from pool:", err);
                    reject({ "err_status": 500, "err_message": "internal server" });
                    return;
                }
                console.log("Database connection established.");
                connection.query(Qry, values, function (err, rows) {
                    connection.release();
                    if (err) {
                        console.error("Error executing query:", err);
                        reject({ "err_status": 500, "err_message": "internal server" });
                        return;
                    }
                    resolve(rows);
                });
            });
        });
    }
};
