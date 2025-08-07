import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Construct the path to the JSON file in the public directory
    const jsonDirectory = path.join(process.cwd(), 'public', 'umamusume', 'data');
    // Read the JSON file
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'races.json'), 'utf8');
    // Parse the JSON file
    const races = JSON.parse(fileContents);
    // Return the JSON data
    return NextResponse.json(races);
  } catch (error) {
    // Handle errors, such as the file not being found
    console.error(error);
    return new NextResponse('Error reading races data', { status: 500 });
  }
}

