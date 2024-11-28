import { NextApiRequest, NextApiResponse } from "next";
import applyMiddleware from "../middleware/applyMiddleware";
import Entries, { EntryType } from "../Models/EntrySchema";
import { MyDecrypt } from "../../../encryption/Encryption";
import Users from "../Models/UserSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    // _id stored as string, so query as string
    // const entryId = '66abc3e1918d0cf3b4018c15';  // Use the string ID directly

    // let entry: EntryType | null = await Entries.findOne({ _id: entryId });

    // if (!entry) {
    //   return res.status(404).json({ message: "Entry not found" });
    // }
    const entry = await Users.find();
    // entry.content = await MyDecrypt(entry.content, '$KSDksdfj@kjadf39dfsa')
    return res.status(200).json({ entry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default applyMiddleware(handler, []);
