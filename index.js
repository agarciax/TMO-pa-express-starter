const port = process.env.PORT || 5000;
const app = require('./app');
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running, listening on port ${port}`);
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())