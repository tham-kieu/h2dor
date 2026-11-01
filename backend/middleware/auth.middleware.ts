import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id?: string;
  _id?: string;
  role: 'user' | 'admin';
}

export type AuthRequest = Request & {
  user: {
    id: string;
    _id: string;
    role: 'user' | 'admin';
  };
};

/**
 * Middleware: Protect route (authentication)
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    // #region agent log
    fetch('http://127.0.0.1:7869/ingest/753ed0be-c942-4757-b9a8-63a047c88878',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1cecdf'},body:JSON.stringify({sessionId:'1cecdf',location:'auth.middleware.ts:protect:entry',message:'protect entry',data:{hasAuthHeader:!!req.headers.authorization,hasToken:!!token},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (!token) {
      return res.status(401).json({ message: 'Không có token' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const id = decoded.id || decoded._id;
    if (!id || !decoded.role) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    // #region agent log
    fetch('http://127.0.0.1:7869/ingest/753ed0be-c942-4757-b9a8-63a047c88878',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1cecdf'},body:JSON.stringify({sessionId:'1cecdf',location:'auth.middleware.ts:protect:decoded',message:'JWT decoded payload',data:{id,hasRole:!!decoded.role,keys:Object.keys(decoded)},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    req.user = {
      id,
      _id: id,
      role: decoded.role,
    };

    // #region agent log
    fetch('http://127.0.0.1:7869/ingest/753ed0be-c942-4757-b9a8-63a047c88878',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1cecdf'},body:JSON.stringify({sessionId:'1cecdf',location:'auth.middleware.ts:protect:reqUser',message:'req.user after assign',data:{user_id:req.user._id,user_role:req.user.role},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    next();
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7869/ingest/753ed0be-c942-4757-b9a8-63a047c88878',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1cecdf'},body:JSON.stringify({sessionId:'1cecdf',location:'auth.middleware.ts:protect:catch',message:'JWT verify failed',data:{errorName:(error as Error)?.name},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

/**
 * Middleware: Admin only
 */
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // #region agent log
  fetch('http://127.0.0.1:7869/ingest/753ed0be-c942-4757-b9a8-63a047c88878',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1cecdf'},body:JSON.stringify({sessionId:'1cecdf',location:'auth.middleware.ts:admin:entry',message:'admin check',data:{hasUser:!!req.user,user_id:req.user?._id,user_role:req.user?.role},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  if (!req.user) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền' });
  }

  next();
};