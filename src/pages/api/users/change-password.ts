import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Users from "../Models/UserSchema";
import MD5 from 'md5';
import verifyUserMiddleware from "../middleware/verify-user-middleware";
type ResponseType = {
  success: boolean;
  error?: string;
  message: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>): Promise<void> {
  try {
    if (req.method === 'POST') {
      const user = req.body.user;
      const {username} = user;
      if(req.body.newPassword !== req.body.confirmPassword){
        return res.status(401).json({ success: false, error: 'Passwords do not match', message: 'Passwords do not match! Password fields must be same' });
      }
      if(req.body.oldPassword.length <= 3 || req.body.newPassword.length <= 3){
        return res.status(401).json({ success: false, error: 'Password is too short', message: 'Too short password! Password should be at least 4 characters long' });
      }
      const userToEdit = await Users.findOneAndUpdate({username: username});
      if(MD5(req.body.oldPassword) === userToEdit.password ){
        if(MD5(req.body.newPassword) === userToEdit.password){
          return res.status(401).json({success: false, error: 'Incorrect Password', message: 'Passwords are same! please enter a different password to change the previous one'})
        }
        userToEdit.password = MD5(req.body.newPassword);
        await userToEdit.save();
        return res.status(200).json({ success: true, message: 'Password changed successfully!' });
      }else{
        return res.status(401).json({ success: false, error: 'Incorrect Password', message: 'Current password is incorrect!' });
      }
    } else {
      return res.status(405).json({ success: false, error: "Bad Request", message: 'This route only supports POST method' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Technical Error', message: 'Some technical error occured' });
  }
}
export default applyMiddleware(handler, [verifyUserMiddleware]);