import type { Request, Response } from "express";
import { User, UserInput } from "./user.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { account, communityId } = req.body;

  if (!account || communityId < 0) {
    return res.status(422).json({
      message: 'The account and community id are required',
    });
  }

  let user = await User.findOne({account});

  if (!user) {
    const userInput: UserInput = {
      account,
      communities: [],
    };

    userInput.communities.push(communityId);
    user = await User.create(userInput);
  }

  if (!user.communities.includes(communityId)) {
    user.communities.push(communityId);
    await user.save();
  }

  const userUpdated = await User.findOne({ account });
  return res.status(201).json(userUpdated);
}
