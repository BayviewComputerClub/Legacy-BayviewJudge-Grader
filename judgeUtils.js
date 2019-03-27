// Node Modules
const fs = require("fs");
const { spawn, exec } = require('child_process');

function scoreOutput(output, expectedOutput, callback) {
    let score = 0;
    if (typeof output == 'undefined') {
        console.log('[Error] Output is undefined.')
        output == "error";
    }
    for(let i = 0; i < expectedOutput.length; i++) {
        // Ignore newlines in the test cases
        //console.log("*********LOOK AT THIS:" + typeof expectedOutput[i] + " - " + typeof output[i]);

        if(expectedOutput[i].replace(/(\r\n|\n|\r)/gm, "") === output[i].replace(/(\r\n|\n|\r)/gm, "")) {
            console.log("Right answer! Expected: " + expectedOutput[i] + " and got: " + output[i]);
            score++;
        } else {
            console.log("Wrong answer! Expected: " + expectedOutput[i] + " but got: " + output[i]);
            callback(score, false, i);
            return;
        }
    }
    callback(score, true, -1);
    return;
}

function judgeSubmission(problemID, userID, inputCode, lang, callback) {
    console.log("[Info] Judging a submission.");
    let result = {accepted: false, time: -1, isTLE: false, isCompileError: false, otherError: false, errorAt: -1, score: -1};

    const problemRoot = './problems/' + problemID;

    // Load the problem metadata (Timemout and Mem Limit)
    const problemMeta = JSON.parse(fs.readFileSync(problemRoot + '/meta.json'));
    // Load the test cases
    const testInput = fs.readFileSync(problemRoot + '/in.txt').toString().split("\n");
    const testOutput = fs.readFileSync(problemRoot + '/out.txt').toString().split("\n");

    // Please ignore callback hell
    switch (lang){
        case "c++":

            // decode and save the code.
            let buff = new Buffer(inputCode, 'base64');
            let inputCodeString = buff.toString('ascii');

            fs.writeFile('./tmp/' + userID + '.cpp', inputCodeString, (err) => {
                if (err) throw err;

                // Compile the input code (Inside firejail)
                //firejail --apparmor --private --net=none --quiet
                exec('g++ ./tmp/' + userID + '.cpp -o ./tmp/' + userID + '.out', (err, stdout, stderr) => {
                    if (err) {
                        console.log('File compile ERROR');
                        result.isCompileError = true;
                        result.accepted = false;
                        callback(result);
                        return
                    }
                    console.log('[Log] Compiled a file with ID: ' + userID)

                    // Mark the file as executable
                    exec('chmod +x ./tmp/' + userID + '.out', (err, stdout, stderr) => {
                        if (err) {
                            console.log('File compile ERROR');
                            result.isCompileError = true;
                            result.accepted = false;
                        }

                        // Time for some fun... run and judge the solution!
                        // Enable Firejail on the Linux server.
                        //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
                        let inputProcess = spawn('./tmp/' + userID + '.out');

                        inputProcess.stdin.setEncoding('utf-8');
                        //inputProcess.stdout.pipe(process.stdout); // debug

                        // Capture the programs output as it happens
                        let inputProcessOutput = [];
                        inputProcess.stdout.on('data', function(data) {
                            //console.log('******************* got data and pushing it... ' + data.toString());
                            inputProcessOutput = data.toString().split("\n");
                        });

                        for(let i of testInput) {
                            //console.log('this is i ' + i)
                            inputProcess.stdin.write(i + '\n');
                        }

                        // When the program exits.
                        inputProcess.on('close', function(code) {
                            // Judge the captured output of the program
                            for(let i of inputProcessOutput) { //debug
                                //console.log('WHATS IN THE ' + i);
                            }

                            scoreOutput(inputProcessOutput, testOutput, function(score, isAccepeted, errorAt) {
                               if(isAccepeted == false) {
                                   result.accepted = false;
                                   result.errorAt = errorAt;
                                   callback(result);
                                   return;
                               } else {
                                   result.accepted = true;
                                   result.score = score;
                                   callback(result);
                                   return;
                               }
                            });
                        });

                        inputProcess.stdin.end();

                    });
                });

            });
            break;
        case "java":
            callback(result);
            break;
    }






}

module.exports = {
    judgeSubmission: judgeSubmission
};
