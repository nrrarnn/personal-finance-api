import { Request, Response } from "express";
import * as pocketService from "../services/pocketService";

export const createPocket = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || (req.body.userId as string); 

    const pocket = await pocketService.createPocket(userId, req.body);

    res.status(201).json({
      success: true,
      data: pocket
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create pocket" });
  }
};

export const getPockets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || (req.query.userId as string);

    const pockets = await pocketService.getUserPockets(userId);

    res.json({
      success: true,
      data: pockets
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pockets" });
  }
};

export const updatePocket = async (req: Request, res: Response) => {
  try {
    const pocket = await pocketService.updatePocket(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: pocket
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update pocket" });
  }
};

export const deletePocket = async (req: Request, res: Response) => {
  try {
    await pocketService.deletePocket(req.params.id);

    res.json({
      success: true,
      message: "Pocket deleted"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pocket" });
  }
};