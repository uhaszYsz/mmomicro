#!/usr/bin/env node

/**
 * Simple test script to verify profiler functionality
 * Run with: node --prof test-profiler.js
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 Testing Node.js profiler functionality...');

// Check if profiler is enabled
if (!process.argv.includes('--prof')) {
    console.log('❌ Profiler not enabled. Run with: node --prof test-profiler.js');
    process.exit(1);
}

console.log('✅ Profiler is enabled');

// Simulate some CPU work
function cpuIntensiveWork() {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
}

console.log('🔄 Running CPU-intensive work...');
const startTime = Date.now();

// Run multiple iterations to generate profiler data
for (let i = 0; i < 10; i++) {
    cpuIntensiveWork();
    console.log(`  Iteration ${i + 1}/10 completed`);
}

const endTime = Date.now();
console.log(`✅ CPU work completed in ${endTime - startTime}ms`);

// Check for profiler log file
const logFiles = fs.readdirSync('.').filter(file => file.endsWith('.log'));
if (logFiles.length > 0) {
    console.log('📊 Profiler log files found:');
    logFiles.forEach(file => {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`  - ${file} (${size} KB)`);
    });
    
    // Try to analyze the most recent log file
    const latestLog = logFiles[logFiles.length - 1];
    console.log(`\n🔍 Attempting to analyze: ${latestLog}`);
    
    const nodeProcess = spawn('node', ['--prof-process', latestLog], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    nodeProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    nodeProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Profiler analysis successful!');
            console.log('📄 Analysis output:');
            console.log('='.repeat(50));
            console.log(output.substring(0, 1000) + '...'); // Show first 1000 chars
            console.log('='.repeat(50));
        } else {
            console.log('❌ Profiler analysis failed:');
            console.log(errorOutput);
        }
    });
} else {
    console.log('❌ No profiler log files found');
}

console.log('\n🏁 Profiler test completed!'); 