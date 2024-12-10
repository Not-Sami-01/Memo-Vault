import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Users from "../Models/UserSchema";
import MD5 from 'md5';
import jwt from 'jsonwebtoken';
import Entries from "../Models/EntrySchema";
import verifyUserMiddleware from "../middleware/verify-user-middleware";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  token?: string;
  username?: string;
  joinedAt?: Date | string;
  totalEntries?: number;
  trashedEntries?: number;
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const {username, userId} = req.body.user;
      const {password} = req.body;
      if(!password){
        return res.status(401).json({success: false, error: 'Authorization revoked', message: 'Please enter your current password to perform this operation'});
      }
      const user = await Users.findOne({ username, _id: userId });
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found', message: 'Something went wrong please try again' });
      }
      if(user.password !== MD5(password)){
        return res.status(401).json({ success: false, error: 'Incorrect Password', message: 'Incorrect password provided, please enter the correct password' });
      }
      await Entries.deleteMany({user_id: userId});
      await Users.deleteOne({_id: userId});
      return res.status(200).json({ success: true, message: 'Account deleted and all related entries are also deleted successfully!' });
    } else {
      return res.status(405).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);