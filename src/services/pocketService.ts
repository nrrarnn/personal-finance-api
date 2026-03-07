import Pocket from "../models/pocketModel";

export const createPocket = async (userId: string, data: any) => {
  const pocket = new Pocket({
    userId,
    name: data.name,
    budget: data.budget,
    period: data.period
  });

  return await pocket.save();
};

export const getUserPockets = async (userId: string) => {
  return await Pocket.find({ userId });
};

export const getPocketById = async (id: string) => {
  return await Pocket.findById(id);
};

export const updatePocket = async (id: string, data: any) => {
  return await Pocket.findByIdAndUpdate(id, data, { new: true });
};

export const deletePocket = async (id: string) => {
  return await Pocket.findByIdAndDelete(id);
};