import { NextResponse } from 'next/server';
import {connectDB } from '@/lib/mongoDB';
import Team from '@/models/Team';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
    console.log("ruinnins")
  try {
      const para = await params;
      console.log(para)
    const {teamId} = para
    await connectDB();

    const team = await Team.findById(teamId);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const registeredAt = new Date(team.createdAt);
    const elapsedSeconds = Math.floor((now.getTime() - registeredAt.getTime()) / 1000);
    const waitTime = 30; // 0.5 minutes

    const canReveal = elapsedSeconds >= waitTime;
    const remainingSeconds = canReveal ? 0 : waitTime - elapsedSeconds;
    return NextResponse.json({
      canReveal,
      remainingSeconds,
      registeredAt: team.createdAt
    });

  } catch (error) {
    console.error('Time check error:', error);
    return NextResponse.json(
      { error: 'Failed to check time' },
      { status: 500 }
    );
  }
}
