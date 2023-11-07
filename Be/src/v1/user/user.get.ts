import type { Request, Response } from 'express';
import { User } from './user.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { account } = req.params;

  const user = await User.findOne({account}).exec();

  if (!user) {
    return res.status(200).json({
      account,
      communities: [],
    });
  }

  return res.status(200).json(user);
};
