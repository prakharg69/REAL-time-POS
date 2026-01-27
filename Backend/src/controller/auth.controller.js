export const  SignUp = async (req,res)=>{

}
export const Login = async (req ,res)=>{
    try {
        res.status(200).json({data:"dataaaaaa"});
    } catch (error) {
        res.status(500).json({message:"error",error});
    }
}