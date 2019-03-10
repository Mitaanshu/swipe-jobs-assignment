const express = require('express');
const router = express.Router();
const getData = require('../service/getData')
const Distance = require('geo-distance');
const moment = require('moment');
const jobEvaluator = require('../service/jobEvaluator');


router.get('/:id', (req, res) => {

    getData.getData().then(data => {

            let jobEvaluation = []; // takes in 4 values in each element - number of matching parameters, number of matching certificate, bill rate, distance
            let score; // stores matching parameter and gives +1 score everytime the given attributes are matched
            let totalMatchingCertificate; // stores total number of required certificate
            // filtering worker id  
            const worker = data.workers.filter(worker => {
                return worker.userId === parseInt(req.params.id)
            })
            // if worker is undefined return
            if (worker[0] == undefined) {
                res.send("Please enter correct worker id")
                return
            }
            // iterating through jobs to model the output in jobEvaluation for each job
            const result = data.jobs.map(job => {
                score = 0;
                totalMatchingCertificate = 0;
                certficateScore = 0;
           
                // if license is matched, score is +1
                if (job.driverLicenseRequired === worker[0].hasDriversLicense) {
                    score += 1;
                }

                // if skill matches job title, score is +1
                if (worker[0].skills.includes(job.jobTitle)) {
                    score += 1;
                }

                // calulating distance 
                const distance = Distance.between({
                    lat: worker[0].jobSearchAddress.latitude,
                    lon: worker[0].jobSearchAddress.longitude
                }, {
                    lat: job.location.latitude,
                    lon: job.location.longitude
                })
                // if in workers proximity, score+1
                if (worker[0].jobSearchAddress.maxJobDistance > distance.human_readable().distance) {
                    score += 1;
                }

                // if worker can start on same day
                let weekDay = moment(job.startDate).format('dddd');
                const start = (worker[0].availability.map(a => {
                    if (a != null) {
                        if (a.title === weekDay) {
                            return true;
                        }
                    }
                }))
                // if yes, score +1, that is worker can start on same day
                if (start.includes(true)) {
                    score += 1;
                }

                // here we count the number of certificates that matches the required certificates
                const certificates = (job.requiredCertificates.map(jobCertificate => {
                    if (worker[0].certificates.includes(jobCertificate)) {
                        totalMatchingCertificate += 1;
                        return true
                    }
                }))

                jobEvaluation.push([score, totalMatchingCertificate, job.billRate, (150 - parseInt(distance.human_readable().distance)), job.jobId])
            })
            // returns sorted columns according to score, if score matches same then goes to totalMatchingCertificate, if total matching certificates then bill rate, if that matches same then distance and sort them accordingly.
            const orderedJobList = (jobEvaluator.evaluator(jobEvaluation))
            const filteredJobs = (data.jobs.filter(job => {
                    return (job.jobId == orderedJobList[0] || job.jobId == orderedJobList[1] || job.jobId == orderedJobList[2])
                })
            )
            res.send(filteredJobs)
        })
        .catch(err => {
            console.log(err.message)
        })
});
module.exports = router;