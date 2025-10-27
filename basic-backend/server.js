/**
 * The address of this Server connected to the network is:
 * URL -> http://localhost:8383
 * IP -> 127.0.0.1:8383
 */

const express = require('express');
const app = express();
const PORT = 8383;

let data = {
  users: ['Emmanuel']
}

// Middleware
app.use(express.json());

// CRUD - Create, Read, Update, Delete

// Endpoint - HTTP Verbs (Method) & Routes (or Paths)
// Website Endpoints

app.get('/', (req, res) => {
  res.send(`
    <body style="background-color:pink; color: blue;">
      <h1>DATA</h1>
      <p>${JSON.stringify(data)}</p>
    </body>
  `);
  // res.status(200).send('<h1>Homepage</h1>');
  // res.send('<h1>This is HTML Code</h1><input placeholder="This is cool" />')
  // console.log('This is a empty endpoint', req.method);
  // res.sendStatus(200);
});

app.get('/dashboard', (req, res) => {
  console.log('Dashboard', req.method);
  res.status(200).send('<h1>Dashboard</h1>');
});



// API Endpoints
app.get('/api/data', (req, res) => {
  console.log('Data');
  res.send(data);
});

app.post('/api/data', (req, res) => {
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name)
  res.sendStatus(201)
});

app.delete('/api/data', (req, res) => {
  data.pop()
  console.log('We deleted the element off the end of the array')
  res.sendStatus(203)
});


app.put('/api/data/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name } = req.body;

  if (isNaN(index) || index < 0 || index >= data.users.length) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Missing name in request body' });
  }

  const oldName = data.users[index];
  data.users[index] = name;
  console.log(`Updated user at index ${index}: ${oldName} → ${name}`);

  res.status(200).json({
    message: 'User updated successfully',
    users: data.users
  });
});


app.listen(PORT, () => console.log(`Server has started on : ${PORT}`));