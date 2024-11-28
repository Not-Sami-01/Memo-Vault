import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Entries, { EntryType, formatDate } from "../Models/EntrySchema";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
type ResponseType = {
  success: boolean;
  error? : string;
  message: string;
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>):Promise<void> {
  try {
    if(req.method === 'POST'){
      const userId = req.body.user.userId;
      const _id = req.body.entryId;
      let entry: any | null = await Entries.findById(_id);
      if(!entry){
        return res.status(404).json({success: false, error: 'Entry not found', message: 'The entry you are trying to update does not exist'});
      }
      if(entry.user_id != userId){
        return res.status(401).json({success: false, error: 'Authorization Revoked', message: 'Authorization revoked! Please login again'});
      }
      await entry.restore();
      return res.status(200).json({success: true, message: 'Entry restored successfully!'});
    }else{
      return res.status(400).json({success: false, error: "Bad Request", message: 'This route only supports POST method'});
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false, error: 'Technical Error', message: 'Some technical error occured'});
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);

