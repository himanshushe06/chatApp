import UserModel from "../model/user.schema.js";

const userVerification = (condition) => {
    return async (req,res,next) => {
        try {
            const { username, email } = req.body;
            const user = await UserModel.findOne({
                $or:[
                    {username},
                    {email}
                ]
            });
            if(condition.mustNotExist && user){
                return res.status(400).json({
                    message:"User already exists"
                });
            }
            if(condition.mustExist && !user){
                return res.status(404).json({
                    message:"User not found"
                });
            }
            req.user = user;
            next();
        } catch(error){
            res.status(500).json({ error:error.message });
        }
    };
};

export default userVerification;