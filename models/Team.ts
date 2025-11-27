import mongoose from "mongoose";
import { z } from "zod";

// ============ TEAM SCHEMA ============

// Zod validation for Team
export const teamValidationSchema = z.object({
  teamName: z.string().optional(),
  teamMembers: z.array(z.string().min(3, "Member name cannot be empty")).min(3, "At least 3 team members are required"),
  assignedScenario: z.string().optional(),
});

export const createTeamSchema = z.object({
  teamName: z.string().optional(),
  teamMembers: z.array(z.string().min(3, "Member name cannot be empty")).min(3, "At least 3 team member are required"),
});

// Mongoose Team schema
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    trim: true,
  },
  teamMembers: {
    type: [String],
    required: [true, "At least one team member is required"],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: "At least one team member is required"
    }
  },
  assignedScenario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scenario",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;