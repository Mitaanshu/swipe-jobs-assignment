const fetch = require('node-fetch');

async function getData() {
    let workerData = await fetch('http://test.swipejobs.com/api/workers');
    let workers = await workerData.json()

    let jobsData = await fetch('http://test.swipejobs.com/api/jobs');
    let jobs = await jobsData.json()

    return {
        workers,
        jobs
    };
}

module.exports.getData = getData;