
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express(); 
const PORT = process.env.PORT || 5000; 

app.use(bodyParser.urlencoded({extended: true}));

app.get("/edit", (req, res) => {
  res.sendFile(path.join(__dirname, '../User', 'profile.html'));
})

app.post("/", (req,res) => {
  res.send("Thanks for Posting that!");

  console.log(req.body);
})

//For the server to load on the specified PORT 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//Git
