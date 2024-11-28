import { NextApiRequest, NextApiResponse } from "next"
import connectDB from "../connection/connect";
export type MiddlewareDataType = {
  success: boolean;
  status: number;
  message?: string;
  error?: string;
  req: NextApiRequest;
  res: NextApiResponse;
}
const applyMiddleware = (handler: any, middlewares:any) => async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await connectDB();
  for(const middleware of middlewares){
    const response = await middleware(req, res);
    if (response.success === true) {
      req = response.req;
      res = response.res;
    } else {
      return res.status(response.status).json({ success: false, error: response.error, message: response.message });
    }
  }
  return handler(req, res);
}
export default applyMiddleware;