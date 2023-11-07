import type { Request, Response } from "express";
import { Community, CommunityInput } from "./community.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { sid, guideline, admin } = req.body;
  if (!sid || !admin) {
    return res.status(400).json({success: false, message: 'Invalid parameters'});
  }

  let community = await Community.findOne({sid: +sid});

  if (!community) {
    const communityInput: CommunityInput = {
      sid: +sid,
      guideline,
      admin,
    };
    community = await Community.create(communityInput);
  } else {
    community.guideline = guideline;
    community.admin = admin;
    await community.save();
  }

  const communityUpdated = await Community.findOne({ sid: +sid });
  return res.status(201).json(communityUpdated);
}
