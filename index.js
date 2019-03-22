// BayviewJudge Grading Server
const express = require('express');
const app = express();
const port = 3000;

// Load server parts
const judgeUtils = require('./judgeUtils');

// Setup middleware
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/v1/judge-submission', function (req, res) {
    res.send('403 Forbidden');
});
app.post('/v1/judge-submission', function (req, res) {
    judgeUtils.judgeSubmission(req.body.problemID, req.body.userID, req.body.inputCode, req.body.lang, function(result) {
        res.send(result);
    });

});

app.listen(port, () => console.log(`Grading Server listening on port ${port}!`));


