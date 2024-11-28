import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Users from "../Models/UserSchema";
import MD5 from 'md5';
import authMiddleware from "../middleware/auth-middleware";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
}

const validateUsername = (username: string) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
  if (regex.test(username)) {
    return true;
  }
  return false;
};
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      let {username, password, confirmPassword}: {username: string; password: string; confirmPassword: string} = req.body;
      username = username.toLowerCase();
      username = username.trim();
      if (!validateUsername(username)) {
        return res.status(401).json({ success: false, error: 'Invalid username', message: 'Username should start with a letter and can contain only letters and numbers' });
      }
      if (!username ||!password ||!confirmPassword) {
        return res.status(401).json({ success: false, error: 'Missing required fields', message: 'Username, password and confirm password are required' });
      }
      if(username.length <= 3){
        return res.status(401).json({ success: false, error: 'Username is too short', message: 'Too short username! Username should be at least 4 characters long' });
      }
      if(password !== confirmPassword){
        return res.status(401).json({ success: false, error: 'Passwords do not match', message: 'Passwords do not match! Password fields must be same' });
      }
      if(password.length <= 3){
        return res.status(401).json({ success: false, error: 'Password is too short', message: 'Too short password! Password should be at least 4 characters long' });
      }
      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        return res.status(403).json({ success: false, error: 'Username already exists', message: 'Username already exists! Please choose a different one' });
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
export default applyMiddleware(handler, [authMiddleware]);