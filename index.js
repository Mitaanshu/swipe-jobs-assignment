 const express = require('express');
 const workers = require('./routes/worker.js')
 const app = express();

 app.use(express.json())
 app.use('/api/worker/jobs',workers)

 const port = process.env.PORT || 5000
 app.listen(port, () => console.log(`Listenning on port ${port}`))