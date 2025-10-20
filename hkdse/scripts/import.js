#!/usr/bin/env node

/**
 * ETL script to import CSV data into D1 database
 * Usage: node import.js <path-to-csv> <database-name>
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = process.argv[2] || '../data/2024_HKDSE_results_statistics_table3f_en.csv';
const DB_NAME = process.argv[3] || 'hkdse';

function parsePercentage(str) {
  if (!str || str === '') return null;
  return parseFloat(str.replace('%', '').replace(',', ''));
}

function parseNumber(str) {
  if (!str || str === '') return null;
  return parseInt(str.replace(',', ''), 10);
}

function main() {
  console.log('Reading CSV file:', CSV_PATH);
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`Parsed ${records.length} records`);

  // Generate SQL INSERT statements
  const inserts = records.map(row => {
    const rowNum = parseNumber(row['No.']);
    const description = row['Description'] || '';
    const type = row['Type'] || '';
    
    let daySchoolNum = null;
    let daySchoolCum = null;
    let allCandNum = null;
    let allCandCum = null;

    if (type === 'Number') {
      daySchoolNum = parseNumber(row['Day School Candidates - No.']);
      daySchoolCum = parseNumber(row['Day School Candidates - Cumulative total']);
      allCandNum = parseNumber(row['All Candidates - No.']);
      allCandCum = parseNumber(row['All Candidates - Cumulative total']);
    } else if (type === 'Percentage') {
      daySchoolNum = parsePercentage(row['Day School Candidates - No.']);
      daySchoolCum = parsePercentage(row['Day School Candidates - Cumulative total']);
      allCandNum = parsePercentage(row['All Candidates - No.']);
      allCandCum = parsePercentage(row['All Candidates - Cumulative total']);
    }

    return `INSERT INTO results (row_number, description, type, day_school_number, day_school_cumulative, all_candidates_number, all_candidates_cumulative) VALUES (${rowNum}, '${description.replace(/'/g, "''")}', '${type}', ${daySchoolNum}, ${daySchoolCum}, ${allCandNum}, ${allCandCum});`;
  });

  const sqlOutput = inserts.join('\n');
  
  // Write to file
  const outputPath = './seed.sql';
  fs.writeFileSync(outputPath, sqlOutput);
  console.log(`Generated SQL file: ${outputPath}`);
  console.log('To import into D1:');
  console.log(`  wrangler d1 execute ${DB_NAME} --file=./seed.sql`);
}

main();
