import React, { Component } from 'react';
import ReactTable from 'react-table';
import './App.css'
import { Button } from 'react-bootstrap';

const http = require('http');
const request = require('request');
var rp = require('request-promise-native');

const connectrequest = {
    url: 'http://127.0.0.1:8082/connect',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

const disconnectrequest = {
    url: 'http://127.0.0.1:8082/disconnect',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      clicks: 0,
      clickspersecond: "0",
      timePassed: 0.01,
      done: 0,
      nowPage: "click",
      no1: '',
      no2: '',
      no3: '',
      no4: '',
      no5: ''
    }
    this.id = false;

  }

  addClick(){
   this.setState({
     clicks: this.state.clicks+1
   })
   if(this.id === false){
     this.id = setInterval(() => this.clicksPerSecond(), 10)
   }
  }

  clicksPerSecond(){
    if(this.state.timePassed >= 10){
      clearInterval(this.id);
      this.setState({
        done: 1,
        clickspersecond: this.state.clicks / 10.01
      })
    }
    else{
      this.setState({
        timePassed: this.state.timePassed + 0.01
      })
      }
    }


  restart(){
    clearInterval(this.id);
    this.setState({
      clicks: 0,
      timePassed: 0
    })

  }

  sButton(){
    this.setState({ nowPage: 'score' })
  }

  render(){

    if(this.state.done === 1) {
      return(
            <div className="Results">
              <p id="result">Results: {(Math.round(10 * this.state.clickspersecond)/10).toFixed(1)} CPS</p>
            </div>
      )
    }
    else if(this.state.nowPage === 'click'){
      return(
          <div className="Main">
            <br/>
            <span className="mainclass">Click Test</span>
            <p className="cps">Clicks: {this.state.clicks}</p>
            <p className="time">
            {((Math.round(100 * this.state.timePassed)/100).toFixed(2) - 0.01).toFixed(2)}</p>
            <Button bsStyle="default" id="click" onClick={() => this.addClick()}></Button>
            <br/><br/>
            <Button bsStyle="default" id="scoreboardButton" onClick={() => this.sButton()}>Scoreboard</Button>
            </div>
      )
    }
    else if(this.state.nowPage === 'score'){
      return(
        <div className="ScoreBoard">
        <p>1. </p>
        <p>2. </p>
        <p>3. </p>
        <p>4. </p>
        <p>5. </p>
        </div>
      )
    }
  }
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      nowPage: "login",
      regText: [],
      currentUser: ''
    }
  }

  componentDidMount(){
    request(connectrequest, function(err, res) {});
  }


  loginButton(){

      // var options = {
      //   url: 'http://127.0.0.1:8082/login/' + document.getElementById("userinput").value + '/' + document.getElementById("passinput").value,
      //   method: 'GET',
      //   headers: {
      //     'User-Agent': 'request'
      //   }
      // }
      //
      // return new Promise(function(resolve, reject) {
      //   request(options, function(err, res, body) {
      //
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(JSON.parse(body));
      //     }
      //   })
      // })

      var userDetails = 'x';
      function login() {

      var options = {
        url: 'http://127.0.0.1:8082/login/' + document.getElementById("userinput").value + '/' + document.getElementById("passinput").value,
        method: 'GET',
        headers: {
          'User-Agent': 'request'
        }
      }

      return rp(options)
    }


    login().then(data => {
      if (data === '0') {
        this.setState({ nowPage: 'main' })
        this.setState({ regText: ''})
      }
      else {
        this.setState({ regText: 'Authentication failed.'})
        console.log(this.state.regText);
      }
    })

    this.setState({ currentUser: document.getElementById("userinput").value })
    }

  inject(){
    this.setState({
      nowPage: "register"
    })
  }

  render() {
    if(this.state.nowPage === "login"){
      return(
        <div className="App">

          <p className="login">Manager</p>
          <p id="userandpass">Username: <label><input type="text" id="userinput"/></label></p>
          <p id="userandpass">Password: <label><input type="password" id="passinput"/></label></p>
          <br/>
          <Button bsStyle="primary" onClick={() => this.loginButton()}>Login</Button>&nbsp;
          <Button bsStyle="primary" onClick={() => this.inject()}>Register</Button>
          <br/>
          <p id="regTextId">{this.state.regText}</p>
        </div>
      );
    }
    else if(this.state.nowPage === "main"){
      return(<Main />)
    }
    else if(this.state.nowPage === "register"){
      return(<Register />)
    }
  }
}

class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      nowPage: 'register'
    }
  }

  registration(){
    var options = {
      host: "127.0.0.1",
      port: 8082,
      path: '/register/' + document.getElementById("registername").value + '/' + document.getElementById("registeremail").value + '/' + document.getElementById("registerpassword").value,
      method: 'PUT',
    };

    console.log(options['host']+":"+options['port']+options['path'])

    const reqq = http.request(options, function(res) {
      var data = '';
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      // A chunk of data has been received.
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', () => {
        console.log(data);
      });
    }).end();
  }

  unReg(){
    this.setState({
      nowPage: 'login'
    })
  }

  render(){
    if(this.state.nowPage === 'register'){
      return(
          <div className="RegisterCSS">
            <p className="register">Register</p><br/><br/>
            <p id="registers">User: <label><input type="text" id="registername" /></label></p>
            <p id="registers">Email: <label><input type="text" id="registeremail"/></label></p>
            <p id="registers">Password: <label><input type="password" id="registerpassword" /></label></p>
            <Button bsStyle="primary" onClick={() => (this.registration(), this.unReg())}>Register</Button>
          </div>

      )
    }
    else if(this.state.nowPage === 'login'){
      return(<App/>)
    }

  }
}

export default App;
