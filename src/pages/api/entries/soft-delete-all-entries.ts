import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Entries, { formatDate } from "../Models/EntrySchema";
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
      await Entries.updateMany({user_id: userId, deleted_at: null}, {$set:{deleted_at: formatDate(Date.now())}});
      return res.status(200).json({success: true, message: 'All Entries moved to recyclebin!'});
    }else{
      return res.status(400).json({success: false, error: "Bad Request", message: 'This route only supports POST method'});
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false, error: 'Technical Error', message: 'Some technical error occured'});
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);

