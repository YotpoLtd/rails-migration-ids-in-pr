const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

try {
    const url  = github.context.payload.pull_request.url + "/files";
    const options = {
        json: true,
        headers: {
            Authorization:  "token " + core.getInput('github-token'),
            'User-Agent': 'request'
        }
    };

    request(url, options, (err, res, body) => {
        if (err) { return console.log(err); }
        const migrationIdsInPR = body.filter(file => file.filename.includes('db/migrate'))
            .map(file => file.filename.match(/[^\\/]+\.[^\\/]+$/).pop()
            .match(/^[^_]+(?=_)/).pop());

        console.log("migration ids in pull request are: " + migrationIdsInPR);
        core.setOutput("migration-ids", migrationIdsInPR);
    });

} catch (error) {
    core.setFailed(error.message);
}
