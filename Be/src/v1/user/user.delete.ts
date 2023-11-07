import type { Request, Response } from "express";
import { User } from "./user.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { account } = req.params;
  const { communityId } = req.body;

  if (communityId < 0) {
    return res.status(422).json({
      message: 'The community id is required',
    });
  }

  let user = await User.findOne({account});

  if (!user) {
    return res.status(422).json({
      message: `The user: ${account} doesn't exist.`,
    });
  }

  user.communities = user.communities.filter(_ => _ != communityId);
  await user.save();

  const userUpdated = await User.findOne({ account });
  return res.status(200).json(userUpdated);
}
