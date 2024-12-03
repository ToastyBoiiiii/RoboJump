const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

function recursiveReadDirectory(path) {
  let fileList = {"path": path, "files": fs.readdirSync(path)};
  
  for(let i = 0; i < fileList["files"].length; i++) {
    if(!fileList["files"][i].includes(".")) {
      fileList["files"][i] = recursiveReadDirectory(`${path}/${fileList["files"][i]}`);
    }
  }

  return fileList;
}

app.post('/resources', (req, res) => {
  const path = `assets/${req.get("path")}`;

  if(path.includes('.')) {
    res.sendStatus(401);
    return;
  }

  if(!fs.existsSync(path)) {
    res.sendStatus(400);
    return;
  }

  res.json(recursiveReadDirectory(path));
});

app.listen(port, () => {
  console.log(`Security risk listening on port ${port}`)
});