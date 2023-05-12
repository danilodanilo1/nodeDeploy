const express = require("express");
const csvtojson = require("csvtojson");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/file" });

app.use(cors()); // habilita o CORS para todas as rotas

app.post("/convert", upload.single("csv"), (req, res) => {
  const csvFilePath = req.file.path;
  csvtojson()
    .fromFile(csvFilePath)
    .then((json) => {
      const jsonFilePath = "uploads/file.json";
      fs.writeFile(jsonFilePath, JSON.stringify(json), (err) => {
        if (err) throw err;
        res.download(jsonFilePath);
      });
    });
});

app.get("/convert", (req, res) => {
  const jsonFilePath = "uploads/file.json";
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

const PORT = process.env.PORT || 3000; // porta do servidor, pode ser qualquer número de sua escolha
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
