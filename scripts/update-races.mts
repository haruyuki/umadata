import * as fs from 'node:fs';
import path from 'path';

// Define the types for the source and target data structures.
interface SourceRace {
  id: number;
  url_name: string;
  name_jp: string;
  name_en: string;
  name_ko?: string;
  name_tw?: string;
  grade: number;
  distance: number;
  direction: number;
  terrain: number;
  track: number;
  list_ura: string[];
}

interface RaceUra {
  id: string;
  instance: number;
  year: number;
  month: number;
  half: number;
  details: SourceRace;
}

interface TargetRace {
  id: number;
  name: string;
  name_jp: string;
  name_en: string;
  name_ko?: string;
  name_tw?: string;
  grade: string;
  distance: number;
  direction: string;
  track: string;
  month: number;
  half: string;
  careerPhase: string;
  location: string;
}

// Mappings
const gradeMap: { [key: number]: string } = {
  100: 'G1',
  200: 'G2',
  300: 'G3',
  400: 'OP',
  700: 'Pre-OP',
  800: 'Maiden',
  900: 'Debut',
};

const directionMap: { [key: number]: string } = {
  1: 'Right',
  2: 'Left',
  3: 'Right (Outer)',
  4: 'Straight',
};

const trackMap: { [key: number]: string } = {
  1: 'Turf',
  2: 'Dirt',
};

const locationMap: { [key: number]: string } = {
  10001: 'Sapporo',
  10002: 'Hakodate',
  10003: 'Niigata',
  10004: 'Fukushima',
  10005: 'Nakayama',
  10006: 'Tokyo',
  10007: 'Chukyo',
  10008: 'Kyoto',
  10009: 'Hanshin',
  10010: 'Kokura',
  10101: 'Ooi',
  10103: 'Kawasaki',
  10104: 'Funabashi',
  10105: 'Morioka',
  10201: 'Longchamp',
  10202: 'Santa Anita',
};

const halfMap: { [key: number]: string } = {
  1: 'Early',
  2: 'Late',
};

const careerPhaseMap: { [key: number]: string } = {
  1: 'Junior',
  2: 'Classic',
  3: 'Senior',
};

const fetchDataFromUrl = async (url: string): Promise<any> => {
  try {
    console.log(`Fetching data from ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP request failed with status: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Find the __NEXT_DATA__ script tag
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );

    if (!nextDataMatch) {
      console.error(`Could not find __NEXT_DATA__ script tag in the page`);
      console.log(`Available script tags with id:`);
      const scriptTags = html.match(/<script[^>]*id="[^"]*"[^>]*>/g);
      if (scriptTags) {
        scriptTags.forEach((tag, index) => console.log(`   ${index + 1}. ${tag}`));
      } else {
        console.log(`   No script tags with id found`);
      }
      throw new Error('Could not find __NEXT_DATA__ script tag in the page');
    }

    console.log(`Found __NEXT_DATA__ script tag`);
    const jsonData = nextDataMatch[1];

    const parsedData = JSON.parse(jsonData);
    console.log(`Successfully parsed JSON data`);

    return parsedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const main = async () => {
  const sourceUrl = 'https://gametora.com/umamusume/races';
  const targetPath = path.resolve('public/umamusume/data/races.json');

  try {
    const sourceData = await fetchDataFromUrl(sourceUrl);

    const raceData: SourceRace[] = sourceData.props?.pageProps?.raceData;
    const raceUraData: RaceUra[] = sourceData.props?.pageProps?.raceUra;

    if (!raceData) {
      console.error(`Race data not found in expected location (props.pageProps.raceData)`);
      console.log(`Available props:`, Object.keys(sourceData.props || {}));
      if (sourceData.props?.pageProps) {
        console.log(`Available pageProps:`, Object.keys(sourceData.props.pageProps));
      }
      throw new Error('Race data not found in expected location');
    }

    if (!raceUraData) {
      console.error(`Race URA data not found in expected location (props.pageProps.raceUra)`);
      throw new Error('Race URA data not found in expected location');
    }

    console.log(`Found ${raceData.length} races and ${raceUraData.length} URA entries`);

    const uraMap = new Map<string, { month: number; half: number; year: number }>();
    raceUraData.forEach((ura) => {
      if (ura.id && ura.month && ura.half && ura.year) {
        uraMap.set(ura.id, { month: ura.month, half: ura.half, year: ura.year });
      }
    });

    const newRaces: TargetRace[] = [];
    let processedRaces = 0;

    raceData.forEach((race, index) => {
      if (race.list_ura && race.list_ura.length > 0) {
        race.list_ura.forEach((uraId) => {
          const timeInfo = uraMap.get(uraId);
          if (timeInfo) {
            newRaces.push({
              id: race.id,
              name: race.url_name,
              name_jp: race.name_jp,
              name_en: race.name_en,
              name_ko: race.name_ko,
              name_tw: race.name_tw,
              grade: gradeMap[race.grade] || `Unknown (${race.grade})`,
              distance: race.distance,
              direction: directionMap[race.direction] || `Unknown (${race.direction})`,
              track: trackMap[race.terrain] || `Unknown (${race.terrain})`,
              month: timeInfo.month,
              half: halfMap[timeInfo.half] || 'Unknown',
              careerPhase: careerPhaseMap[timeInfo.year] || 'Unknown',
              location: locationMap[race.track] || `Unknown (${race.track})`,
            });
          }
        });
        processedRaces++;
      }

      // Log progress every 50 races
      if ((index + 1) % 50 === 0) {
        console.log(`   Processed ${index + 1}/${raceData.length} races...`);
      }
    });

    console.log(`Converted ${processedRaces} races into ${newRaces.length} race entries`);

    const targetJson = {
      races: newRaces,
    };

    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      console.log(`Creating target directory: ${targetDir}`);
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, JSON.stringify(targetJson, null, 2));
    const fileSizeKB = Math.round(fs.statSync(targetPath).size / 1024);

    console.log(`Successfully saved to ${targetPath}`);
    console.log(`   - Source races: ${raceData.length}`);
    console.log(`   - Processed races: ${processedRaces}`);
    console.log(`   - Output race entries: ${newRaces.length}`);
    console.log(`   - Output file size: ${fileSizeKB}KB`);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
};

main().catch(console.error);
