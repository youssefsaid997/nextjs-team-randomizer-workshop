import mongoose from "mongoose";
import { z } from "zod";

export const scenarioValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  isAssigned: z.boolean().optional().default(false),
});

export const createScenarioSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(1, "Description is required"),
});

// Mongoose Scenario schema
const scenarioSchema = new mongoose.Schema({
  scenarioNumber: {
    type: Number,
    required: [true, "Scenario number is required"],
    unique: true,
  },
  realCompany: {
    type: String,
    required: [true, "Real company name is required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  isAssigned: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Scenario = mongoose.models.Scenario || mongoose.model("Scenario", scenarioSchema);

export default  Scenario ;