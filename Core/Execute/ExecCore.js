const fs = require("fs");
const { spawn, exec } = require('child_process');

function execSubmission(submissionRequest, callback) {
    // Write the submission to a file.
    switch(submissionRequest.lang) {
        case "c++":
            execCppFile(submissionRequest, (result, inputProcessOutput) => {
                callback(result, inputProcessOutput);
                return;
            });
            break;
    }
}

function execCppFile(submissionRequest, callback) {

    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID + '/source.out';
    // Create directory first.
    // Time for some fun... run and judge the solution!
    // Enable Firejail on the Linux server.
    //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
    let inputProcess = spawn(directory, []);

    inputProcess.stdin.setEncoding('utf-8');
    //inputProcess.stdout.pipe(process.stdout); // debug

    // Capture the programs output as it happens
    let inputProcessOutput = [];
    inputProcess.stdout.on('data', function(data) {
        console.log('******************* got data and pushing it... ' + data.toString().split("\n"));
        console.log(typeof data.toString().split("\n"));
        let dataOutput = data.toString().split("\n");
        inputProcessOutput = inputProcessOutput.concat(dataOutput);
        inputProcessOutput.pop();
    });

    // Write the test case data into the program.
    for(let i of submissionRequest.input) {
        //console.log('this is i ' + i)
        inputProcess.stdin.write(i + '\n');
    }

    // When the program exits.
    inputProcess.on('close', function(code) {
        // Judge the captured output of the program
        for(let i of inputProcessOutput) { //debug
            console.log('WHATS IN THE ' + i);
        }
        callback(true, inputProcessOutput);


    });

    // TLE todo
    setTimeout(function(){ inputProcess.stdin.end(); inputProcess.kill(); }, 3000);


}

module.exports = {
    execSubmission: execSubmission
};