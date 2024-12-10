import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
import Entries, { EntryType, formatDate } from "../Models/EntrySchema";
import { MyEncrypt } from "@/encryption/Encryption";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  entryId?: string | null | undefined;
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',  // Set the body size limit to 5MB
    },
  },
};
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const userId = user.userId;
      const data: any[] = req.body.data;
      for (let entryData of data) {
        const entry: Record<string, any> = {
          content: entryData.content,
          tag: entryData.tag || '',
          user_id: userId,
          deleted_at: null,
          entry_date_time: formatDate(entryData.entry_date_time) || formatDate(Date.now()),
        };

        if (entryData.created_at) {
          entry.created_at = entryData.created_at;
        }

        if (entryData.updated_at) {
          entry.updated_at = entryData.updated_at;
        }
        const entryToSave = new Entries(entry);
        await entryToSave.save();
      }
      return res.status(200).json({ success: true, message: "Entries imported successfully" });
    } else {
      return res.status(400).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}

export default applyMiddleware(handler, [verifyUserMiddleware]);