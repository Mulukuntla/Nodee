const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/Expense');
const Forgotpassword = require('../models/forgotPassword');
const Sib=require("sib-api-v3-sdk")


const forgotpassword = async (req, res) => {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENGRID_API_KEY;  // Assuming you have the Sendinblue API key in environment variable

    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const { email } =  req.body;
    const id = uuid.v4();
        const user = await User.findOne({where : { email }});
        if(user){
            
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
            }
    const sender = {
        email: "yours.saisaketh@gmail.com",  // Replace with a verified sender email
    };
    const receivers = [{
        email:email,  // Get the user's email from the request body
    }];
    
    try {
        // Send the transactional email using Sendinblue API
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password Reset Request",
            textContent: "Click the link below to reset your password:\n" +
                         `http://51.20.67.98:4000/password/resetpassword/${id}`,
        });
        
        console.log(response);  // Log the response from Sendinblue

        // Respond back to the client indicating success
        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (err) {
        // Catch errors from the API call
        console.error(err);
        res.status(500).json({ message: "An error occurred while sending the email.", success: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    console.log(id)
    Forgotpassword.findOne({ where : { id:id,active:true}}).then(forgotpasswordrequest => {
        console.log(forgotpasswordrequest)
       
        
        if(forgotpasswordrequest !=null){
            forgotpasswordrequest.update({ active: false});
            
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
            }
            else{
                res.status(200).send(`<html>
                   

                    <h1>Link Expired</h1>
                </html>`
                )
            }
            
        
    }).catch(err =>{
        
        console.log(err)
    })
  
}
    


const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly updated new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

    
}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword

}