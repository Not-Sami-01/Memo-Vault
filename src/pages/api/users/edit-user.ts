import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Users from "../Models/UserSchema";
import MD5 from 'md5';
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const {username, password, confirmPassword} = req.body;
      if (!username ||!password ||!confirmPassword) {
        return res.status(401).json({ success: false, error: 'Missing required fields', message: 'Username, password and confirm password are required' });
      }
      if(password !== confirmPassword){
        return res.status(401).json({ success: false, error: 'Passwords do not match', message: 'Passwords do not match! Password fields must be same' });
      }
      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        return res.status(401).json({ success: false, error: 'Username already exists', message: 'Username already exists! Please choose a different one' });
      }
      const hashedPassword = MD5(password);
      const newUser = new Users({username, password: hashedPassword});
      await newUser.save();
      return res.status(200).json({ success: true, message: 'Account created successfully! Now you can login with this account' });
    } else {
      return res.status(405).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, []);