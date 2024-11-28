import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
import Entries, { EntryType, formatDate } from "../Models/EntrySchema";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  entryId?: string | null | undefined;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const userId = user.userId;
      const newEntry = new Entries({
        tag: '',
        content: '',
        user_id: userId,
        entry_date_time: formatDate(Date.now())
      });
      await newEntry.save();
      return res.status(200).json({ success: true, message: "Successfully fetched all the entries",  entryId: newEntry._id });
    } else {
      return res.status(400).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);