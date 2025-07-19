require('dotenv').config();
const session = require('express-session');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { getAllReports } = require('./db');
const { saveReport } = require('./db');
const { deleteReport } = require('./db');

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve anything inside /public
app.use(session({
  secret : process.env.SESSION_CODE,
  resave: false,
  saveUninitialized: false

}))
app.use((req,res,next) =>{
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
})
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.get('/login', (req,res) =>{
  res.sendFile(path.join(__dirname, 'views','login.html'))
})

app.get('/admin', (req, res) => {
  if(req.session.loggedIn){
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
  }
  else{
    res.redirect('/login')
  }
});

app.get('/api/reports', async (req,res) => {
  try{
  let reports = await getAllReports()
  res.json(reports);
  }
  catch (err){
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports'})
  }
})

app.post('/logout', (req,res) => {
  req.session.destroy(err => {
    if (err){
      res.status(500).json({err:'Error logging out'})
    }
    res.clearCookie('connect.sid')
    res.status(200).json({success: "Logged out successfuly"})
  })
})

app.post('/login',(req,res,next) =>{
  if(req.body.password == process.env.ADMIN_PASSWORD){
    req.session.loggedIn = true;
    res.status(200).json({success:"Success"})
  }
  else{
    res.status(401).json({error: "Incorrect Password"})
  }
})

app.post('/api/reports', async (req,res) => {
  try{
    const {title,description,tags} = req.body    
    const savedReport = await saveReport(title, description, tags);
    res.status(201).json(savedReport);

  }
  catch (err) {
    console.error('POST /api/reports failed:', err);
    res.status(500).json({ error: 'Could not save report' });
  }
})

app.delete('/api/reports/:id', async (req, res) => {
  const id = req.params.id
  try {
    const deletedReport = await deleteReport(id);
    res.status(204).json(deletedReport)
  }
  catch (err){
    console.error(`Delete ${id} failed`, err)
    res.status(500).json({error: 'Could not delete report'})
  }
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
