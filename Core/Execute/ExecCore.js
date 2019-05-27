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
        case "java":
            execJavaFile(submissionRequest, (result, inputProcessOutput) => {
                callback(result, inputProcessOutput);
                return;
            });
            break;
        case "python":
            execPythonFile(submissionRequest, (result, inputProcessOutput) => {
                callback(result, inputProcessOutput);
                return;
            });
            break;
    }
}

function execCppFile(submissionRequest, callback) {

    console.log("[Info] Executing a C++ program");

    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID + '/source.out';
    // Create directory first.
    // Time for some fun... run and judge the solution!
    // Enable Firejail on the Linux server.
    //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
    let inputProcess = spawn(directory, []);

    let hasTLE = false;

    console.log("TLE set to: " + submissionRequest.timelimit);
    /*let tletimer = setTimeout(function(){
        console.log("Reached TLE!");
        hasTLE = true;
        inputProcess.stdin.end();
        inputProcess.kill();
        callback(false, inputProcessOutput);
    }, submissionRequest.timelimit);*/

    inputProcess.stdin.setEncoding('utf-8');
    //inputProcess.stdout.pipe(process.stdout); // debug

    // Capture the programs output as it happens
    let inputProcessOutput = [];
    inputProcess.stdout.on('data', function(data) {
        console.log("Data from program *************: " + data.toString());
        console.log(data.toString());
        inputProcessOutput.push(data.toString());
    });

    // Write the test case data into the program.
    try {
        for(let i of submissionRequest.input) {
            //console.log('this is i ' + i;
            console.log("~~ We are about to write some data. Will it crash? ~~");
            inputProcess.stdin.write(i + '\n');
        }
    } catch (e) {
        console.log("!!!!!! There was an e: " + e);
    }


    // When the program exits.
    inputProcess.on('close', function(code) {
        if(hasTLE) {
            console.log("Program exited but has TLE first.")
        } else {
            console.log("Program exited and made it on time")
            // Judge the captured output of the program

            let fullString = "";
            for(let i of inputProcessOutput) { //debug
                console.log('WHATS IN THE ' + i);
                fullString = fullString + i;
            }
            //clearTimeout(tletimer);
            console.log("[DEBUG] The stringed output is: " + fullString);

            callback(true, fullString.split("\n"));
        }

    });

    process.stdout.on('error', function( err ) {
        if (err.code == "EPIPE") {
            console.log("THE PROGRAM DIEEEEEEDDDDDD");
            process.exit(0);
        }
    });


}

function execJavaFile(submissionRequest, callback) {

    console.log("[Info] Executing a Java program");

    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    // Create directory first.
    // Time for some fun... run and judge the solution!
    // Enable Firejail on the Linux server.
    //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
    let inputProcess = spawn('cd ' + directory + ' && java Main' ,{ shell: true });

    let hasTLE = false;

    console.log("TLE set to: " + submissionRequest.timelimit);
    let tletimer = setTimeout(function(){
        console.log("Reached TLE!");
        hasTLE = true;
        //inputProcess.stdin.end();
        //inputProcess.kill();
        //callback(false, inputProcessOutput);
    }, submissionRequest.timelimit);

    inputProcess.stdin.setEncoding('utf-8');

    // Capture the programs output as it happens
    let inputProcessOutput = [];
    inputProcess.stdout.on('data', function(data) {
        console.log(data.toString());
        inputProcessOutput.push(data.toString());
    });

    // Write the test case data into the program.
    for(let i of submissionRequest.input) {
        //console.log('this is i ' + i)
        inputProcess.stdin.write(i + '\n');
    }

    // When the program exits.
    inputProcess.on('close', function(code) {
        if(hasTLE) {
            console.log("Program exited but has TLE first.")
        } else {
            console.log("Program exited and made it on time")
            // Judge the captured output of the program

            let fullString = "";
            for(let i of inputProcessOutput) { //debug
                console.log('WHATS IN THE ' + i);
                fullString = fullString + i;
            }
            clearTimeout(tletimer);
            console.log("[DEBUG] The stringed output is: " + fullString);

            callback(true, fullString.split("\n"));
        }


    });


}

function execPythonFile(submissionRequest, callback) {

    console.log("[Info] Executing a Python program");

    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    // Create directory first.
    // Time for some fun... run and judge the solution!
    // Enable Firejail on the Linux server.
    //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
    let inputProcess = spawn('cd ' + directory + ' && python3 -u Main.py' ,{ shell: true });

    let hasTLE = false;

    console.log("TLE set to: " + submissionRequest.timelimit);
    let tletimer = setTimeout(function(){
        console.log("Reached TLE!");
        hasTLE = true;
        inputProcess.stdin.end();
        inputProcess.kill();
        callback(false, inputProcessOutput);
    }, submissionRequest.timelimit);

    inputProcess.stdin.setEncoding('utf-8');

    // Capture the programs output as it happens
    let inputProcessOutput = [];
    inputProcess.stdout.on('data', function(data) {
        console.log(data.toString());
        inputProcessOutput.push(data.toString());
    });

    inputProcess.stderr.on('data', function(data) {
        console.log("[Python ERROR] " + data.toString());
    });

    // Write the test case data into the program.
    for(let i of submissionRequest.input) {
        //console.log('this is i ' + i)
        inputProcess.stdin.write(i + '\n');
    }

    // When the program exits.
    inputProcess.on('close', function(code) {
        if(hasTLE) {
            console.log("Program exited but has TLE first.")
        } else {
            console.log("Program exited and made it on time")
            // Judge the captured output of the program

            let fullString = "";
            for(let i of inputProcessOutput) { //debug
                console.log('WHATS IN THE ' + i);
                fullString = fullString + i;
            }
            clearTimeout(tletimer);
            console.log("[DEBUG] The stringed output is: " + fullString);

            callback(true, fullString.split("\n"));
        }


    });


}

module.exports = {
    execSubmission: execSubmission
};