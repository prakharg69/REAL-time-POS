import User from "../modules/user.model.js";

export const UserDetail = async(req,res)=>{
    try {
         console.log("get my shop controller entry ");
        const Id = req.userId;
        const user = await User.findById(Id).select("fullName email emailVerified  profilePhoto subscriptionPlan subscriptionStatus activeShopId")
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
         res.status(200).json({data:user});
          
        
    } catch (error) {
        return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    }
}