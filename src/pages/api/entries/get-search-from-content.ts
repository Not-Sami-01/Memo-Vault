import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
import Entries, { EntryType } from "../Models/EntrySchema";
import { MyDecrypt } from "@/encryption/Encryption";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  entries?: any;
}
function likeSearch(text : string, pattern:string) {
  const escapedPattern = pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  const regex = new RegExp(escapedPattern, 'i');
  return regex.test(text);
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const userId = user.userId;
      const order = req.body.order;
      const entries: EntryType[] | [] = await Entries.find({ user_id: userId, deleted_at: { $eq: null } }).sort({ entry_date_time: order });
      const search = req.body.search.trim();
      let selectedEntries: EntryType[]|null = []
      for (let entry of entries) {
        const content = await MyDecrypt(entry.content, process.env.NEXT_PUBLIC_ENCRYPT_KEY || '');
        if (likeSearch(content,search))
        selectedEntries.push(entry);
      }
      return res.status(200).json({ success: true, message: "Successfully fetched all the entries", entries: selectedEntries });
    } else {
      return res.status(400).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);