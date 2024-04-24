exports.createUser = (name,email, password, callback) => {
    // Check if the user already exists
    let context = "Signup user api"
    const checkQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    // console.log(checkQuery)
    dbutil.execQuery(dbconnection, checkQuery,context, [email], (error, rows) => {
        // console.log(checkQuery)
        if (error) {                                               
            return callback(error);
        }
        // console.log(rows)
        const userExists = rows[0].count > 0;
        // console.log(userExists)

        if (userExists) {
            // User already exists, return an error message
            return callback(null, { message: 'User already exists' , code : 409});
        } else {
            // User doesn't exist, proceed with the insertion
            // Hash the password
            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    return callback(hashError);
                }
                const insertQuery = 'INSERT INTO users ( name, email, password) VALUES (?, ?, ?)';
                dbutil.execQuery(dbconnection, insertQuery,context, [ name, email, hashedPassword], (queryError) => {
                    if (queryError) {
                        return callback(queryError);
                    }
                    // User inserted successfully
                    return callback(null, { message: 'User created successfully' });
                });
            });
        }
    });
};



exports.passwordCheck = (emaillogin, passwordlogin, callback) => {
    let context = "password checkup";
    const query = "SELECT * FROM users WHERE email = ?";
    
    dbutil.execQuery(dbconnection, query, context, [emaillogin], async (queryError, rows) => {
        if (queryError) {
            return callback(queryError);
        }
        
        if (rows.length === 0) {
            // No user found with the given email
            return callback(null, {message :"Invalid Credentials",code : 400});
        }
        
        const user = rows[0]; // Extract the first row
        console.log(user)
        const comparePass = await bcrypt.compare(passwordlogin, user.password);
        
        if (!comparePass) {
            // Passwords don't match
            return callback(null, {message : "Invalid Credentials",code : 401});
        } else {
            // Passwords match, return the user
            return callback(null, user);
        }
    });
};



// exports.sendMailToUSerFunction = (email,callback) => { 
//     console.log(email)
//     let context = "User checkup"
//     const query = "select * from users where email= ?"
//     // console.log(emailforget)
//     dbutil.execQuery(dbconnection,query,context,[email],async(err,rows)=>{
//         if(err){
//             return callback(err)
//         }
//         if(rows.length === 0){
//             console.log(rows)
//             return callback(null,false)
//         } 
//         else{
//             return callback(null,{mail : rows[0].email})   
//         }
//     })
// }

exports.UpdatePasssword = (email, oldPass, newPAss, confirmPass, callback) => {
    let context = "User checkup";
    const query = "SELECT * FROM users WHERE email = ?";
    dbutil.execQuery(dbconnection, query, context, [email], async (err, rows) => {
        if (err) {
            return callback(err);
        }
        if (rows.length === 0) {
            return callback(null, false); // User not found
        } else {
            const user = rows[0];
            const compareOldPass = await bcrypt.compare(oldPass, user.password);
            if (!compareOldPass) {
                return callback(null, false); // Password mismatch
            } else {
                if (newPAss !== confirmPass) {
                    return callback(null, false); // New passwords don't match
                } else {
                    const newHashPass = await bcrypt.hash(newPAss, 10);
                    let contextupdatePAss = "Update password based on correct old password";
                    let queryUpdatePass = `UPDATE users SET password = ? WHERE email = ?`;
                    dbutil.execQuery(dbconnection, queryUpdatePass, contextupdatePAss, [newHashPass, email], (err, results) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, true); // Password updated successfully
                    });
                }
            }
        }
    });
};
