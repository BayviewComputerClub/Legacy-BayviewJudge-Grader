/*
    BayviewJudge Grading Server
    Copyright (C) 2019  Seshan Ravikumar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

 */
const express = require('express');
const app = express();
const port = 3000;

// Load server parts
const judgeUtils = require('./judgeUtils');

// Setup middleware to parse JSON
app.use(express.json({limit: '128mb', extended: true}));

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/v1/judge-submission', function (req, res) {
    res.send('403 Forbidden');
});
app.post('/v1/judge-submission', function (req, res) {
    console.log("~~ We got a new request ~~");
    judgeUtils.judgeSubmission(req.body.problemID, req.body.userID, req.body.inputCode, req.body.lang, req.body.input, req.body.output, req.body.timelimit,function(result) {
        res.send(result);
    });

});

app.listen(port, () => console.log(`Grading Server listening on port ${port}!`));

