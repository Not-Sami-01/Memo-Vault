import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
import Entries from "../Models/EntrySchema";
import { EntryType } from "../Models/EntrySchema";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  entry?: EntryType;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const userId = user.userId;
      const entryId = req.body.entryId;
      const entry = await Entries.findOne({'_id': entryId ,deleted_at: { $eq: null }});
      if (!entry) {
        return res.status(404).json({ success: false, error: 'Entry not found', message: 'The entry you are trying to fetch does not exist' });
      }
      if(entry.user_id !== userId){
        return res.status(401).json({ success: false, error: 'Authorization Revoked', message: 'Authorization revoked! Please login again' });
      }
      return res.status(200).json({ success: true, message: "Successfully fetched the entry",  entry });
    } else {
      return res.status(400).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);