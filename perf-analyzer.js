const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Find the most recent isolate log file
function findLatestIsolateLog() {
    const files = fs.readdirSync('.')
        .filter(file => file.startsWith('isolate-') && file.endsWith('.log'))
        .map(file => ({
            name: file,
            time: fs.statSync(file).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
    
    return files.length > 0 ? files[0].name : null;
}

// Run performance analysis
function runPerfAnalysis() {
    const isolateLog = findLatestIsolateLog();
    
    if (!isolateLog) {
        console.log('No isolate log files found. Run your app with --prof flag first.');
        console.log('Example: node --prof server.js');
        return;
    }
    
    console.log(`Analyzing performance log: ${isolateLog}`);
    
    const outputFile = `perf-analysis-${Date.now()}.txt`;
    const outputStream = fs.createWriteStream(outputFile);
    
    const profProcess = spawn('node', ['--prof-process', isolateLog]);
    
    profProcess.stdout.on('data', (data) => {
        outputStream.write(data);
        process.stdout.write(data); // Also show in console
    });
    
    profProcess.stderr.on('data', (data) => {
        outputStream.write(data);
        process.stderr.write(data); // Also show in console
    });
    
    profProcess.on('close', (code) => {
        outputStream.end();
        console.log(`Performance analysis completed with code: ${code}`);
        console.log(`Results saved to: ${outputFile}`);
    });
    
    profProcess.on('error', (err) => {
        outputStream.end();
        console.error('Error running performance analysis:', err);
    });
}

// Run the analysis
runPerfAnalysis(); 