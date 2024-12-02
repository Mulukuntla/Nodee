const uuid = require('uuid');

const bcrypt = require('bcrypt');
const User = require('../models/Expense');
const Forgotpassword = require('../models/forgotPassword');
const Sib=require("sib-api-v3-sdk")
const sequelize = require("../util/database")




function isstringvalid(string){
    if(string.length===0 || string==undefined){
      return true
    }
    else{
      return false
    }
  }
const forgotpassword = async (req, res) => {
    const t=await sequelize.transaction()
    try{
        const { email } =  req.body;
        if(isstringvalid(email)){
            return res.status(400).json({success:false,message:"Parameters missing"})
        }
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SENDBLUE_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const id = uuid.v4();
        const user = await User.findOne({where : { email }});
        if(user ==null){
            return res.status(404).json({message:"user not found",success:false})
        }
        if(user){
           await user.createForgotpassword({ id , active: true },{transaction:t})
        }
        const sender = {
            email: "yours.saisaketh@gmail.com",
        };
        const receivers = [{
            email:email,
        }];
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password Reset Request",
            textContent: "Click the link below to reset your password:\n" +
                            `http://51.20.172.55:4000/password/resetpassword/${id}`,
        });
        console.log(response);  
        await t.commit()
        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
        await t.rollback()
        console.error(err);
        res.status(500).json({ message: "An error occurred while sending the email.", success: false });
    }

}

const resetpassword = async (req, res) => {
    
    try{
        const id =  req.params.id;
        console.log(console.log("req.params",req.params))
        const forgotpasswordrequest=await Forgotpassword.findOne({ where : { id:id,active:true}})
        if(forgotpasswordrequest !=null){
            console.log(forgotpasswordrequest)
            forgotpasswordrequest.update({ active: false});
            res
            .status(200)
            .send(`<html>
                    <form action="/password/updatepassword/${id}" method="GET">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>reset password</button>
                    </form>
                    </html>`
                )
        }
        else{
            res.status(401).send(`<html>
                <h1>Link Expired</h1>
            </html>`
            )
        }
    }
    catch(err){
        console.log(err)
    }
  
}
    


const updatepassword = async (req, res) => {
    try {
        
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        if(isstringvalid(newpassword)){
            return res.status(400).json({success:false,message:"Parameters missing"})
        }
        const resetpasswordrequest=await Forgotpassword.findOne({ where : { id: resetpasswordid }})
        const user=await User.findOne({where: { id : resetpasswordrequest.userId}})
        if(user){
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);  
            const hash = await bcrypt.hash(newpassword, salt); 
            await user.update({ password: hash });
            res.status(201).json({message: 'Successfuly updated new password'})
        }
        else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
        
            
    } catch(error){
        return res.status(403).json({ error:error, success: false } )
    }
}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword

}