import countermodel from "../modules/countermodel.js"


export const getNextCounterValue =async (counterId)=>{
             const counter = await countermodel.findByIdAndUpdate({_id:counterId},{$inc:{seq:1}},{new: true,upsert:true});
             return counter.seq;
}
   
