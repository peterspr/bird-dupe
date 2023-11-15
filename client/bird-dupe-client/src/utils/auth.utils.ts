import jwt from "jsonwebtoken";

const isValidToken = (token: string) => {
    if (!token) {
      return false;
    }
  
    const payload: any = jwt.decode(token);
    if (!payload) {
      return false;
    }
  
    const expiryTime = payload.exp;
    const currentTime = Date.now();
    return expiryTime > currentTime;
  };
  
  export { isValidToken };