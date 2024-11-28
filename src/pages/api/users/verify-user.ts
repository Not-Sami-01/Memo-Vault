import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Users from "../Models/UserSchema";
import MD5 from 'md5';
import jwt from 'jsonwebtoken';
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
  token?: string;
  username?: string;
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const username = req.body.username.toLowerCase().trim();
      const password = req.body.password;
      if(!username || !password){
        return res.status(400).json({ success: false, error: 'Missing required fields', message: 'Missing Required fields! Username and password are required' });
      }
      const user = await Users.findOne({ username });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid Credentials', message: 'Invalid username or password' });
      }
      if (user.username === username && MD5(password) === user.password) {
        const token = jwt.sign({ username, userId: user._id }, process.env.JWT_SECRET_KEY || '');
        return res.status(200).json({ success: true, message: 'Congratulations! Signed in successfully!', token, username })
      } else
        return res.status(401).json({ success: false, error: 'Invalid Credentials', message: 'Invalid username or password' });
    } else {
      return res.status(405).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, []);