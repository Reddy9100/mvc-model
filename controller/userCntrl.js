const userModel = require("../model/userMdl");

exports.signupUser = (req, res) => {
    const { name,email,password } = req.body;

    userModel.createUser( name,email, password, (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.code === 409) {
            return res.status(409).json({ message: 'Duplicate User Entry' ,code : result.code});
        }

        return res.status(201).json({ message: 'User created successfully' });
    });
};





exports.loginUser = (req, res) => {
    const { emaillogin, passwordlogin } = req.body;
    console.log(req.body)

    userModel.passwordCheck(emaillogin, passwordlogin, (err, result) => {
        if (err) {
            console.error("Error checking password:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.code === 400 || result.code === 401) {
            return res.status(404).json({ message: "Invalid credentials", code: 404 });
        }

        // Generate JWT token
        const token = jwt.sign({ id: result.id }, "dataevolve@112", { expiresIn: "5h" });

        return res.status(200).json({ message: "Login success", token });
    });
};

// exports.sendMailToUSer = (req,res) =>{
//     // console.log(req)
//     const {email} = req.body
//     // console.log(emailforget)
//     userModel.sendMailToUSerFunction(email,(err,results)=>{
//         if(err){
//             return res.status(500).json({message : "Intenal server Error"})
//         }
//         if(!results){
//             return res.status(400).json({message : "User is not registered"})
//         }
//         else{
//             const mailOfser = results.mail
//             console.log(mailOfser)
//             const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                   user: "reddysaikanthuri3@gmail.com",
//                   pass: process.env.EMAILPASS
//                 }
//             });
//             // console.log(transporter)
           
//               // async..await is not allowed in global scope, must use a wrapper
//               async function main() {
//                 // send mail with defined transport object
//                 const otp = Math.floor(Math.random() * 10000)
//                 // console.log(otp)
//                 const info = await transporter.sendMail({
//                   from: process.env.EMAIL, // sender address
//                   to: results.mail,
//                   subject: "PASSWORD RESET", // Subject line
//                   text: "Otp for password reset", // plain text body
//                   html: `<b>Use this otp for the New Password Creation ${otp}</b>`, // html body 
//                 });
//                 // console.log(info)
              
//                 // console.log("Message sent: %s", info.messageId);
//                 // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//               }
              
//               main().catch(console.error);
//             return res.status(200).json({message : `Mail sent to ${results.mail}`})
//         }
//     })
// }


exports.updatePasswordController = (req, res) => {
    
    const { email, oldPass, newPass, confirmPass } = req.body;
    
    userModel.UpdatePasssword(email, oldPass, newPass, confirmPass, (err, success) => {
        if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ success: false, message: "An error occurred while updating the password" });
        }
        if (success === 'userNotFound') {
            return res.status(404).json({ success: false, message: "User not found. Please check your email." });
        }
        if (success === 'passwordMismatch') {
            return res.status(400).json({ success: false, message: "Old password does not match. Please enter the correct old password." });
        }
        if (!success) {
            return res.status(400).json({ success: false, message: "Failed to update password. Please check your credentials." });
        }
        res.status(200).json({ success: true, message: "Password updated successfully" });
    });
};
