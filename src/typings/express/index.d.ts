import { JwtPayload } from "jsonwebtoken";


declare global {
  namespace Express {
    interface Request extends Request {
      user: User;
      jwt?: string;
    }
  }
}
