// Node Modules
const fs = require("fs");
const { spawn, exec } = require('child_process');

function scoreOutput(output, expectedOutput, callback) {
    let score = 0;
    if (typeof output == 'undefined') {
        console.log('[Error] Output is undefined.');
        output = "error";
    }
    for(let i = 0; i < expectedOutput.length; i++) {
        // Ignore newlines in the test cases
        //console.log("*********LOOK AT THIS:" + typeof expectedOutput[i] + " - " + typeof output[i]);
        console.log("[Debug] Judge Iteration " + i);
        let strippedExpectedOuput = expectedOutput[i].replace(/(\r\n|\n|\r)/gm, "");
        let strippedOutput = output[i].replace(/(\r\n|\n|\r)/gm, "");
        if(strippedExpectedOuput === strippedOutput) {
            console.log("[Debug] Right answer! Expected: " + strippedExpectedOuput + " and got: " + strippedOutput);
            score++;
        } else {
            console.log("[Debug] Wrong answer! Expected: " + strippedExpectedOuput + " but got: " + strippedOutput);
            callback(score, false, i);
            return;
        }
    }
    callback(score, true, -1);
    return;
}

function judgeSubmission(problemID, userID, inputCode, lang, input, output, callback) {
    console.log("[Info] Judging a submission.");
    let result = {accepted: false, time: -1, isTLE: false, isCompileError: false, otherError: false, errorAt: -1, score: -1};

    const problemRoot = './problems/' + problemID;

    // Load the problem metadata (Timemout and Mem Limit)
    //const problemMeta = JSON.parse(fs.readFileSync('1' + '/meta.json'));
    // Load the test cases
    //const testInput = fs.readFileSync(problemRoot + '/in.txt').toString().split("\n");
    //const testOutput = fs.readFileSync(problemRoot + '/out.txt').toString().split("\n");

    const testInput = new Buffer(input, 'base64').toString('ascii').split("\n");
    const testOutput = new Buffer(output, 'base64').toString('ascii').split("\n");

    console.log('[Info] Parsed Input and Output Cases');
    console.log('[Debug] Input Cases: ' + testInput[0]);
    console.log('[Debug] Output Cases: ' + testOutput[0]);

    let compileCommand = "echo oof";
    let chmodCommand = "echo oof";
    let spawnCommand = "echo";

    let fileName = '';
    let execName = '';

    switch (lang){
        case "c++":
            compileCommand = 'g++ ./tmp/' + userID + '.cpp -o ./tmp/' + userID + '.out';
            chmodCommand = 'chmod +x ./tmp/' + userID + '.out';
            spawnCommand = './tmp/' + userID + '.out';
            fileName = './tmp/' + userID + '.cpp';
            break;
        case "java":
            // HACK! Todo:Make user folders
            compileCommand = 'javac Main.java -cp tmp/';
            chmodCommand = 'mv Main.class ./tmp/Main.class';
            spawnCommand = 'java';
            fileName = './tmp/Main.java';
            execName = "Main";
            break;
        default:
            break;
    }

    // Please ignore callback hell

    // decode and save the code.
    let buff = new Buffer(inputCode, 'base64');
    let inputCodeString = buff.toString('ascii');

    fs.writeFile(fileName, inputCodeString, (err) => {
        if (err) throw err;

        // Compile the input code (Inside firejail)
        //firejail --apparmor --private --net=none --quiet
        exec(compileCommand, (err, stdout, stderr) => {
            if (err) {
                console.log('File compile ERROR');
                result.isCompileError = true;
                result.accepted = false;
                callback(result);
                return
            }
            console.log('[Log] Compiled a file with ID: ' + userID);

            // Mark the file as executable
            exec(chmodCommand, (err, stdout, stderr) => {
                if (err) {
                    console.log('File compile ERROR');
                    result.isCompileError = true;
                    result.accepted = false;
                }

                // Time for some fun... run and judge the solution!
                // Enable Firejail on the Linux server.
                //let inputProcess = spawn('firejail', ['--seccomp', '--quiet', '--net=none', './tmp/' + userID + '.out']);
                let inputProcess = spawn(spawnCommand, ['-cp', 'tmp/', execName]);

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

                for(let i of testInput) {
                    //console.log('this is i ' + i)
                    inputProcess.stdin.write(i + '\n');
                }

                // When the program exits.
                inputProcess.on('close', function(code) {
                    // Judge the captured output of the program
                    for(let i of inputProcessOutput) { //debug
                        console.log('WHATS IN THE ' + i);
                    }

                    scoreOutput(inputProcessOutput, testOutput, function(score, isAccepeted, errorAt) {
                        if(isAccepeted === false) {
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

                // TLE
                setTimeout(function(){ inputProcess.stdin.end(); inputProcess.kill(); }, 3000);


            });
        });

    });



}

module.exports = {
    judgeSubmission: judgeSubmission
};
