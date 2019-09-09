const express = require('express');


const DBconnection = require('./config/db');
DBconnection();

const app = express();



app.use(express.json({extended:false}));
app.get('/', (req, res)=> res.send('Server up and running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
