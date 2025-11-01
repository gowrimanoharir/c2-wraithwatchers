/**
 * ONE-TIME CSV IMPORT SCRIPT
 * 
 * This script imports the ghost sightings CSV data into your Supabase database.
 * 
 * Prerequisites:
 * 1. Run database-setup.sql in Supabase SQL Editor
 * 2. Create .env.local with your Supabase credentials
 * 3. Run: npm run import-data
 */

import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please create .env.local with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CSVRow {
  'Date of Sighting': string;
  'Latitude of Sighting': string;
  'Longitude of Sighting': string;
  'Nearest Approximate City': string;
  'US State': string;
  'Notes about the sighting': string;
  'Time of Day': string;
  'Tag of Apparition': string;
  'Image Link': string;
}

async function importData() {
  console.log('🚀 Starting CSV data import to Supabase...\n');

  // Check if data already exists
  const { count } = await supabase
    .from('sightings')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    console.log(`⚠️  Database already contains ${count} records`);
    console.log('Do you want to add more data? (This will duplicate records)');
    console.log('To clear first, run in Supabase: DELETE FROM sightings;\n');
    
    // For safety, exit if data exists
    console.log('Exiting to prevent duplicates. Clear the table first if needed.\n');
    process.exit(0);
  }

  // Read CSV file
  const csvPath = path.join(process.cwd(), 'public', 'ghost_sightings_12000_with_images.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  console.log('📄 Reading CSV file...');

  // Parse CSV
  const parseResult = await new Promise<Papa.ParseResult<CSVRow>>((resolve, reject) => {
    Papa.parse<CSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results),
      error: (error: Error) => reject(error),
    });
  });

  console.log(`✅ Parsed ${parseResult.data.length} rows from CSV\n`);

  // Transform data
  const sightings = parseResult.data
    .map((row) => ({
      date_of_sighting: row['Date of Sighting'] || '',
      latitude: parseFloat(row['Latitude of Sighting']) || 0,
      longitude: parseFloat(row['Longitude of Sighting']) || 0,
      city: row['Nearest Approximate City'] || '',
      state: row['US State'] || '',
      notes: row['Notes about the sighting'] || '',
      time_of_day: row['Time of Day'] || '',
      tag: row['Tag of Apparition'] || '',
      image_link: row['Image Link'] || '',
    }))
    .filter((sighting) => sighting.latitude !== 0 && sighting.longitude !== 0);

  console.log(`🔍 Filtered to ${sightings.length} valid sightings\n`);

  // Insert in batches
  const batchSize = 500;
  const totalBatches = Math.ceil(sightings.length / batchSize);
  let successCount = 0;

  console.log(`📦 Uploading ${sightings.length} sightings in ${totalBatches} batches...\n`);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, sightings.length);
    const batch = sightings.slice(start, end);

    console.log(`⏳ Batch ${i + 1}/${totalBatches} (rows ${start + 1}-${end})...`);

    const { error } = await supabase.from('sightings').insert(batch);

    if (error) {
      console.error(`❌ Error in batch ${i + 1}:`, error.message);
    } else {
      console.log(`✅ Batch ${i + 1} completed`);
      successCount += batch.length;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${successCount} records`);
  console.log('='.repeat(50));

  // Verify
  const { count: finalCount } = await supabase
    .from('sightings')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎉 Total records in database: ${finalCount}`);
  console.log('\n✨ Import complete! Your app is ready to use.\n');
}

importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });

