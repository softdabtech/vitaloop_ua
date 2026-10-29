#!/usr/bin/env node

/**
 * Smoke Test - UA Version
 * Tests Ukrainian frontend build and structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tests = { passed: 0, failed: 0 };

function logTest(name, status, details = '') {
  const icon = status === 'PASS' ? '✓' : '✗';
  const color = status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${icon}\x1b[0m ${name}${details ? ` — ${details}` : ''}`);
  if (status === 'PASS') tests.passed++; else tests.failed++;
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    logTest(description, 'PASS');
    return true;
  } else {
    logTest(description, 'FAIL', `Not found: ${filePath}`);
    return false;
  }
}

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  try {
    const files = fs.readdirSync(dir, { recursive: true });
    return files.filter(f => f.endsWith(ext)).length;
  } catch {
    return 0;
  }
}

console.log('🧪 Ukrainian Frontend Smoke Test (vitaloop_ua)\n');
console.log('='.repeat(60));

// 1. Check dist build
console.log('\n📦 Build Artifacts:');
const distPath = path.join(__dirname, 'dist');
const distExists = checkFileExists(distPath, 'dist/ folder exists');

if (distExists) {
  const jsCount = countFiles(distPath, '.js');
  const cssCount = countFiles(distPath, '.css');
  logTest(`JavaScript chunks`, jsCount > 0 ? 'PASS' : 'FAIL', `Found ${jsCount}`);
  logTest(`CSS stylesheets`, cssCount > 0 ? 'PASS' : 'FAIL', `Found ${cssCount}`);
}

// 2. Check source structure
console.log('\n📁 Source Structure:');
const srcPath = path.join(__dirname, 'src');
checkFileExists(path.join(srcPath, 'App.jsx'), 'App.jsx exists');
checkFileExists(path.join(srcPath, 'main.jsx'), 'main.jsx exists');
checkFileExists(path.join(srcPath, 'pages'), 'pages/ folder exists');
checkFileExists(path.join(srcPath, 'components'), 'components/ folder exists');

// 3. Check Ukrainian cabinet pages
console.log('\n🇺🇦 Ukrainian Cabinet:');
const uaCabinetDir = path.join(srcPath, 'pages', 'ua-cabinet');
if (fs.existsSync(uaCabinetDir)) {
  const uaPages = fs.readdirSync(uaCabinetDir).filter(f => f.endsWith('.jsx'));
  logTest(`UA Cabinet exists`, 'PASS', `${uaPages.length} components`);
  
  const requiredUA = ['UaDashboard.jsx', 'UaUpload.jsx', 'UaResults.jsx', 'UaProtocol.jsx', 'UaQuestionnaire.jsx'];
  requiredUA.forEach(page => {
    checkFileExists(path.join(uaCabinetDir, page), `  ${page}`);
  });
} else {
  logTest('UA Cabinet exists', 'FAIL');
}

// 4. Check Ukrainian landing pages
console.log('\n📄 Ukrainian Landing Pages:');
const uaPages = [
  'UaLanding.jsx',
  'UaPage.jsx'
];
const pagesDir = path.join(srcPath, 'pages');
uaPages.forEach(page => {
  checkFileExists(path.join(pagesDir, page), page);
});

// 5. Check configuration
console.log('\n⚙️  Configuration:');
checkFileExists(path.join(__dirname, 'package.json'), 'package.json');
checkFileExists(path.join(__dirname, 'vite.config.js'), 'vite.config.js');

// Summary
console.log('\n' + '='.repeat(60));
console.log(`\n✅ Results: ${tests.passed} passed, ${tests.failed} failed`);

if (tests.failed === 0) {
  console.log('\n🇺🇦 Ukrainian frontend is ready for deployment!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${tests.failed} test(s) failed.\n`);
  process.exit(1);
}
