
var express = require("express");
var path = require("path");
var fs=require("fs");


var app = express();
var PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", express.static(__dirname + '/public'));  



app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  app.get("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) throw err;
       console.log(data);
        res.end(data);
      });
  });

  app.post("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) throw err;
        var oldStuff=[];
        var newStuff = req.body;    
        oldStuff=JSON.parse(data);  
        newStuff['id']=oldStuff.length;  
        oldStuff.push(newStuff);
             fs.writeFile ('./db/db.json',JSON.stringify(oldStuff), function (err) {
            if (err) {
                return console.log (err);
            }
            console.log ('Success!');
            });
        
        res.end(data);
      });

  });

  app.delete("/api/notes/:id", function(req, res) {
      console.log(`a delete request came in for item ${req.params.id}`);

      fs.readFile('./db/db.json', 'utf8',(err, data) => {
        if (err) throw err;
        
        var dataSet=JSON.parse(data);
       
        var newSet=[];
        var thisItem; 
        var newCounter=0;      
        for (let i=0; i<dataSet.length;i++){
            if (i!== parseInt(req.params.id)) {
                thisItem=dataSet[i];
                thisItem['id']=newCounter;       
                newSet.push(thisItem);
                newCounter++;
            }
        }
        console.log(newSet);

        
        
        fs.writeFile ('./db/db.json',JSON.stringify(newSet), function (err) {
            if (err) {
                return console.log (err);
            }
            console.log ('Success!');
        });
        
        res.end(data);
      });

      res.end();
  });

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});