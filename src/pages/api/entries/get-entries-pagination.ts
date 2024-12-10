import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
import Entries, { EntryType } from "../Models/EntrySchema";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  entries?: any;
  totalLength?: number;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const userId = user.userId;
      const page = req.body.page;
      const order = req.body.order;
      const limit = req.body.limit;
      const offset = (page - 1) * limit;
      const entries: EntryType[] = await Entries.find({ user_id: userId, deleted_at: { $eq: null } }).skip(offset).limit(limit).sort({ entry_date_time: order });
      const totalLength = await Entries.countDocuments({ user_id: userId, deleted_at: { $eq: null } });
      return res.status(200).json({ success: true, message: "Entries fetched successfully", entries, totalLength });
    } else {
      return res.status(400).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);