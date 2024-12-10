import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "@/pages/api/middleware/applyMiddleware";
import Entries from "./Models/EntrySchema";
import Users from "./Models/UserSchema";
type ResponseType = {
  success: boolean;
  error? : string;
  message: string;
  entries?: any;
  users?: any;
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>):Promise<void> {
  try {
    const reqMethod = 'GET'
    if(req.method === reqMethod){
      if(req.query.get=== 'entries'){
        const entries = await Entries.find();
        return res.status(200).json({success: true, message: 'Fetching entries was successful', entries});
      }else if(req.query.get=== 'users'){
        const users = await Users.find();
        return res.status(200).json({success: true, message: 'Fetching users was successful', users});
      }
      return res.status(200).json({success: true, message:'Hello world!'});
    }else{
      return res.status(400).json({success: false, error: "Bad Request", message: `This route only supports ${reqMethod} method`});
    }
  } catch (error) {

    return res.status(500).json({success: false, error: 'Technical Error', message: 'Some technical error occured'});
  }
}
export default applyMiddleware(handler, []);




// import fs from 'fs';
// import { MyEncrypt } from "@/encryption/Encryption";

// async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //   try {
    //     const filePath = 'E:/MyWorkSpace/Programming Projects/Next js Projects/memo-vault/ChronoJournal_Journals.json';
    //     const data = await fs.promises.readFile(filePath, 'utf-8');
    //     let journals: any[] = [];
    //     const key = '$KSDksdfj@kjadf39dfsa'
    //     try {
      //       journals = JSON.parse(data);
      //     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//       journals = data.split('\n');
//     }
//     let entries = [];
//     for (let journal of journals) {
//       // let { _id, content, deleted_at, tag, journal_data_and_time, created_at, updated_at, user_id} : EntryType = journal; 
//       // let entry = new Entries({
//       //   user_id,
//       //   content: await MyEncrypt(content, key ),
//       //   _id,
//       //   created_at,
//       //   updated_at,
//       //   deleted_at
//       // });
//       // await entry.save();
//       const content = await MyEncrypt(journal.content, key);
//       journal.content = content;
//       entries.push(journal);
//     }
//     await fs.promises.writeFile('E:/MyWorkSpace/Programming Projects/Next js Projects/memo-vault/encodedJournals.json', JSON.stringify(entries), { encoding: 'utf8' });
//     return res.status(200).json({ success: true, message: 'data Entered successFUlly', entries });
//   } catch (error) {
//     console.error('Error reading file:', error);
//     return res.status(500).json({ success: false, error: error });
//   }
// }
// export default applyMiddleware(handler, []);
