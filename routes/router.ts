import { Router, Request, Response } from "express";
import { IdentifyRequest, IdentifyResponse } from "../types/api";
import { identifyService } from "../services/identifyService";

const router = Router();
router.post("/identify", async (
  req: Request<{}, {}, IdentifyRequest>,
  res: Response<IdentifyResponse>
) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res.status(400).json({} as IdentifyResponse);
  }
  try {
    const result = await identifyService(email, phoneNumber);
    return res.status(200).json({
      contact: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({} as IdentifyResponse);
  }
});

export = router;

