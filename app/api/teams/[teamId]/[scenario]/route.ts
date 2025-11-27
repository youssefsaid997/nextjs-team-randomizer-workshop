import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongoDB';
import Team from '@/models/Team';

export async function GET(
  request: NextRequest,
  {params}: { params: Promise<{ teamId: string,scenario: string  }> }
) {
  try {
    const { teamId } = await params;

    await connectDB();

    const team = await Team.findById(teamId).populate('assignedScenario');

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if 2 minutes have passed
    const now = new Date();
    const registeredAt = new Date(team.createdAt);
    const elapsedSeconds = Math.floor((now.getTime() - registeredAt.getTime()) / 1000);

    if (elapsedSeconds < 30) {
      return NextResponse.json(
        { 
          error: 'Scenario not ready yet',
          remainingSeconds: 30 - elapsedSeconds 
        },
        { status: 403 }
      );
    }

    if (!team.assignedScenario) {
      return NextResponse.json(
        { error: 'No scenario assigned' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scenario: {
        id: team.assignedScenario._id,
        title: team.assignedScenario.title,
        description: team.assignedScenario.description
      },
      team: {
        id: team._id,
        teamName: team.teamName,
        members: team.teamMembers
      }
    });

  } catch (error) {
    console.error('Fetch scenario error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario' },
      { status: 500 }
    );
  }
}