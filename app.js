require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");



// create the connection information for the sql database
/*
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "process.env.DB_PASSWORD",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });*/

  const start = () => {
    inquirer
      .prompt({
        name: "start",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all roles",
          "View all departments"
        ]
      })
      .then(function(answer) {
        switch (answer.start) {
        case "View all employees":
          viewEmps();
          break;
  
        case "View all roles":
          viewRoles();
          break;
  
        case "View all departments":
          viewDepts();
          break;
        }
      });
  }

  const viewEmps = () => {
      console.log("Hello, Emps.");
  }
  
  const viewRoles = () => {
      console.log("Hello, Roles.");
  }
  
  const viewDepts = () => {
      console.log("Hello, Emps.");
  }

  start();