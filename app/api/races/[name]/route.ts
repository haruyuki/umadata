import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Race } from '@/app/types';

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const raceName = params.name;

    const jsonDirectory = path.join(process.cwd(), 'public', 'umamusume', 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'races.json'), 'utf8');
    const data = JSON.parse(fileContents);
    const races: Race[] = data.races;

    const race = races.find((r) => r.name === raceName);

    if (race) {
      return NextResponse.json(race);
    } else {
      return new NextResponse(JSON.stringify({ message: `Race with name "${raceName}" not found` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Error reading races data', { status: 500 });
  }
}

