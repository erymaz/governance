import type { Request, Response } from "express";
import { Aggregation } from "./aggregation.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  try {
    await Aggregation.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message || '',
    });
  }
}
