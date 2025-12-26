#!/usr/bin/env node

/**
 * UploadThing v7 Token Generator
 * 
 * Creates a base64 encoded token for UploadThing v7
 * 
 * Usage:
 *   node scripts/create-uploadthing-token.js
 * 
 * Or with values:
 *   node scripts/create-uploadthing-token.js YOUR_API_KEY YOUR_APP_ID us-east-1
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createToken(apiKey, appId, region = 'us-east-1') {
  const token = {
    apiKey: apiKey,
    appId: appId,
    regions: [region]
  };

  const base64Token = Buffer.from(JSON.stringify(token)).toString('base64');
  return base64Token;
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🔧 UploadThing v7 Token Generator\n');
  console.log('This script will help you create a base64 encoded token for UploadThing v7.\n');

  // Get values from command line args or prompt
  let apiKey = process.argv[2];
  let appId = process.argv[3];
  let region = process.argv[4] || 'us-east-1';

  if (!apiKey) {
    apiKey = await prompt('Enter your UploadThing API Key (sk_live_... or sk_test_...): ');
  }

  if (!appId) {
    appId = await prompt('Enter your UploadThing App ID: ');
  }

  if (!process.argv[4]) {
    const regionInput = await prompt('Enter your region (us-east-1, eu-west-1, etc.) [default: us-east-1]: ');
    region = regionInput.trim() || 'us-east-1';
  }

  // Validate inputs
  if (!apiKey || !appId) {
    console.error('\n❌ Error: API Key and App ID are required!');
    process.exit(1);
  }

  // Create token
  const token = createToken(apiKey, appId, region);

  console.log('\n✅ Token created successfully!\n');
  console.log('Add this to your .env.local file:\n');
  console.log(`UPLOADTHING_TOKEN=${token}\n`);
  console.log('Or copy just the token:\n');
  console.log(token);
  console.log('\n📝 Note: Make sure .env.local is in your .gitignore file!\n');

  rl.close();
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

