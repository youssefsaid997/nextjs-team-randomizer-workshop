"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AddTeamMemberForm } from "./forms/AddMemeberForm";
import { CustomFormInput } from "./FormInput";

type TeamMember = {
  id: string;
  name: string;
};

// Validation schemas
const teamNameSchema = z
  .string()
  .min(2, "Team name must be at least 2 characters")
  .max(50, "Team name is too long")
  .optional()
  .or(z.literal(""));

const memberNameSchema = z
  .string()
  .min(1, "Member name cannot be empty")
  .max(50, "Member name is too long")
  .trim();

const teamValidationSchema = z.object({
  teamName: teamNameSchema,
  teamMembers: z
    .array(memberNameSchema)
    .min(3, "You need at least 3 team members"),
});

export default function TeamRegistration() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const addMember = (newMember: { name: string }) => {
    // Validate member name before adding
    const validation = memberNameSchema.safeParse(newMember.name);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Validation failed";
      setError(errorMessage);
      return;
    }

    // Check for duplicate names
    if (
      team.some((m) => m.name.toLowerCase() === newMember.name.toLowerCase())
    ) {
      setError("Member with this name already exists");
      return;
    }

    const member: TeamMember = {
      ...newMember,
      id: Date.now().toString(),
    };
    setTeam([...team, member]);
    setError(""); // Clear error on successful add
  };

  const removeMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id));
    setValidationErrors({});
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeamName(value);

    // Clear team name validation error when user types
    if (validationErrors.teamName) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.teamName;
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setValidationErrors({});

    // Validate before submission
    const validation = teamValidationSchema.safeParse({
      teamName: teamName.trim() || undefined,
      teamMembers: team.map((m) => m.name),
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      setValidationErrors(errors);
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: teamName.trim() || undefined,
          teamMembers: team.map((m) => m.name),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to waiting page with team ID
      router.push(`/waiting/${data.team.id}`);
    } catch (err) {
      const er = err as Error;
      setError(er.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl min-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-gray-50">
        Team Management
      </h1>

      <div className="space-y-2 bg-white p-4 rounded-xl my-4 w-full border border-gray-800">
        <CustomFormInput
          label="Team name"
          name="team-name"
          value={teamName}
          onChange={handleTeamNameChange}
          placeholder="Team Tesla"
          required
        />
        {validationErrors.teamName && (
          <p className="text-red-400 text-sm mt-1">
            {validationErrors.teamName}
          </p>
        )}
      </div>

      <div className="flex gap-4 w-full">
        <div className="w-full">
          <AddTeamMemberForm onAdd={addMember} />
        </div>
        <div className="w-full">
          <TeamList members={team} onRemove={removeMember} />
          {validationErrors.teamMembers && (
            <p className="text-red-400 text-sm mt-2">
              {validationErrors.teamMembers}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {team && teamName && team.length > 2 && (
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-black py-2.5 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition font-medium cursor-pointer mt-6 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          {loading ? "Submitting..." : "Submit Team"}
        </button>
      )}
    </div>
  );
}

type TeamMemberItemProps = {
  member: { id: string; name: string };
  onRemove: (id: string) => void;
};

export function TeamMemberItem({ member, onRemove }: TeamMemberItemProps) {
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-800 hover:shadow-md transition">
      <div>
        <h4 className="font-semibold text-gray-100">{member.name}</h4>
      </div>
      <button
        onClick={() => onRemove(member.id)}
        className="text-red-400 hover:text-red-300 font-medium text-sm cursor-pointer"
      >
        Remove
      </button>
    </div>
  );
}

type TeamListProps = {
  members: TeamMember[];
  onRemove: (id: string) => void;
};

export function TeamList({ members, onRemove }: TeamListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No team members added yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <TeamMemberItem key={member.id} member={member} onRemove={onRemove} />
      ))}
    </div>
  );
}
