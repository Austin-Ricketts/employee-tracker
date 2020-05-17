require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");




// create the connection information for the sql database

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
  });

  const start = () => {
    inquirer
      .prompt({
        name: "start",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all roles",
          "View all departments",
          "Add a role",
          "Add a department"
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
        
        case "Add a role":
          addRoles();
          break;
        
        case "Add a department":
          addDepts();
          break;
        }
      });
  }

  const viewEmps = () => {

    let query = "SELECT * FROM employee";
    
    connection.query(query, function(err, res) {
        console.log("-------------------------------");
        console.table(res)});
    
   inquirer.prompt({
        name: "return",
        type: "confirm",
        message: "Would you like to keep searching?"
    })
    .then(function(answer) {
        if (answer.return === true) {start();}
        else {connection.end();}
    });
  }
  
  const viewRoles = () => {
    let query = "SELECT * FROM role";
    
    connection.query(query, function(err, res) {
        console.log("-------------------------------");
        console.table(res)});
    
   inquirer.prompt({
        name: "return",
        type: "confirm",
        message: "Would you like to keep searching?"
    })
    .then(function(answer) {
        if (answer.return === true) {start();}
        else {connection.end();}
    });
  }

  const addRoles = () => {
    inquirer.prompt([
        {
        name: "title",
        type: "input",
        message: "What is the name of the new role?"
    },
    {
        name: "salary",
        type: "input",
        message: "Please enter the salary for the new role, excluding any commas."
    },
    {
        name: "depId",
        type: "input",
        message: "What is the Department ID number for this new role?"
    }])
    .then(function(answer) {
        connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.depId
        })
        viewRoles();
    });
}
  
  const viewDepts = () => {
    let query = "SELECT * FROM department";
    
    connection.query(query, function(err, res) {
        console.log("-------------------------------");
        console.table(res)});
    
   inquirer.prompt({
        name: "return",
        type: "confirm",
        message: "Would you like to keep searching?"
    })
    .then(function(answer) {
        if (answer.return === true) {start();}
        else {connection.end();}
    });
  }

  const addDepts = () => {
      inquirer.prompt({
          name: "newDept",
          type: "input",
          message: "What is the name of your new department?"
      })
      .then(function(answer) {
          connection.query("INSERT INTO department SET ?", {
              name: answer.newDept
          })
          viewDepts();
      });
  }


  