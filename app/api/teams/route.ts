// app/api/teams/register/route.ts
import { NextResponse } from 'next/server';

import Team , {createTeamSchema} from '@/models/Team';
import Scenario  from '@/models/Scenario';
import { connectDB } from '@/lib/mongoDB';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate with Zod
    const validation = createTeamSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.name },
        { status: 400 }
      );
    }

    const { teamName, teamMembers } = validation.data;
        const teams = await Team.find({})

    if(teams.length === 6){
      
      return NextResponse.json(
        { error: 'Registration is closed.' },
        { status: 400 }
      );
    }

    // Find all unassigned scenarios
    const availableScenarios = await Scenario.find({ isAssigned: false });

    if (availableScenarios.length === 0) {
      return NextResponse.json(
        { error: 'All scenarios have been assigned. Registration is closed.' },
        { status: 400 }
      );
    }

    // Randomly select one scenario
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    const selectedScenario = availableScenarios[randomIndex];



    // Create the team with assigned scenario
    const team = await Team.create({
      teamName: teamName || `Team ${Date.now()}`,
      teamMembers,
      assignedScenario: selectedScenario._id
    });

    // Mark scenario as assigned
    selectedScenario.isAssigned = true;
    selectedScenario.assignedTo = team._id;
    await selectedScenario.save();

    // Populate the scenario details for response
    await team.populate('assignedScenario');

    return NextResponse.json({
      success: true,
      team: {
        id: team._id,
        teamName: team.teamName,
        members: team.teamMembers,
        scenario: {
          id: team.assignedScenario._id,
          title: team.assignedScenario.title,
          description: team.assignedScenario.description
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}