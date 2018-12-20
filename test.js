var express = require('express');
var app = express();
var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

app.get('/connect', function (req, res) {
   if (con.state === "disconnected"){
    con.connect(function(err) {
      if (err) throw err;
      console.log("Successfully connected.");
    });
  }
  res.end("Successfully connected.")
})

app.put("/register/:user/:email/:password", (req, res) => {
    // var data = req.params["name"];
   var data = req.params;
   var dataname = req.params["user"];
   var dataemail = req.params["email"];
   var datapass = req.params["password"];
   console.log(`${dataname}`, `${datapass}`);
   var namecheck = (`SELECT id FROM user_details WHERE name='${dataname}'`)
   con.query(namecheck, function (err, result) {
     if (err) throw err;
     console.log(result)
     if(result != ""){
       console.log("Name already taken.")
     }

     else{
       var sql = `INSERT INTO user_details (name, email, password) VALUES ('${dataname}', '${dataemail}', '${datapass}')`;
       con.query(sql, function (err, result) {
         if (err) throw err;
         console.log("1 record inserted");
       });
     }
     })
    res.send(req.params);
});

app.get('/disconnect', function (req, res) {
  con.end(function(err) {
    if (err) throw err;
    console.log("Successfully disconnected.");
  });
  res.end("Successfully disconnected.")
})

app.get('/login/:user/:password', (req, res) => {

  var flag = "init";
  var name = req.params["user"];
  var pass = req.params["password"];
  var sql = `SELECT password FROM user_details WHERE name='${name}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log('here is the result');
    //console.log(result);
    if (result.length!==0){
      //console.log(result);
      if(result[0].password === pass){
        console.log("Login successful.");
        flag = '0';
        res.write(flag);
        res.end();

      }
      else{
        console.log("Invalid username or password.")
        console.log(result[0].password);
        flag = '1';
        res.write(flag);
        res.end();
      }
    }
    else {
      //we are here if wrong user name was submitted
      flag = '1';
      res.write(flag);
      res.end();
    }


  });

  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
  //
  // async function demo() {
  //   console.log('Taking a break...');
  //   await sleep(5000);
  //   console.log('Two second later');
  // }
  //
  // demo();


  });

var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server is now running on port", port + ".")

})
