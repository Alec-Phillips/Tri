const express = require('express')
const app = express()
const port = 3033

app.use(express.static("./src"));

app.listen(port, () => {
  console.log(`dev server running on ${port}`)
})
