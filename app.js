// Dependency requirements: 
// 1) dotenv for security, 
// 2) mysql for database connection, 
// 3) inquirer for question prompts, 
// and 4) console.table for cleaner data in the command line
require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");




// Standard mysql connection code

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Username
  user: "root",

  // Password protected by dotenv
  password: "process.env.DB_PASSWORD",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // prompts are started upon connection to database
    start();
  });
// Questions for User enabled by the Inquirer npm package
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
          "Add an employee",
          "Add a role",
          "Add a department",
          "Update an employee role"
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
        
        case "Add an employee":
          addEmps();
          break;
        
        case "Add a role":
          addRoles();
          break;
        
        case "Add a department":
          addDepts();
          break;
        
        case "Update an employee role":
          confirmUpdate();
          break;
        }
      });
  }
// All functions are grouped according to employee, role, or department
// The group of employee functions comes first, then functions for role, 
// finally come the functions for departments
// This function allows the user to view all employees in the command line
  const viewEmps = () => {

    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;";
    
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
// This function allows the user to add a new employee
// Then the user is returned to view all employees
  const addEmps = () => {
    inquirer.prompt([
        {
        name: "first",
        type: "input",
        message: "What is the first name of the new employee?"
    },
    {
        name: "last",
        type: "input",
        message: "What is the last name of the new employee?"
    },
    {
        name: "roleId",
        type: "input",
        message: "What is the Role ID number for this new employee?"
    },
    {
        name: "manId",
        type: "input",
        message: "What is the Manager ID number for this new employee?"
    }])
    .then(function(answer) {
        connection.query("INSERT INTO employee SET ?", {
            first_name: answer.first,
            last_name: answer.last,
            role_id: answer.roleId,
            manager_id: answer.manId
        })
        viewEmps();
    });
}
// When the user decides to update an employee's information, 
// this function checks whether the user would actually like to do that
const confirmUpdate = () => {
    inquirer.prompt({
        name: "update",
        type: "confirm",
        message: "Would you like to continue with updating an employee?"
    })
    .then(function(answer) {
        if (answer.update === true) {updateEmps();}
        else {start();}
    });
}
// Given that the user does wish to update an employee, 
// this function handles that update, based on employee ID
// Then the user is returned to view all employees
const updateEmps = () => {
    
            inquirer.prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What is the employee's original ID?"
                },
                {
                    name: "first",
                    type: "input",
                    message: "Update first name"
                },
                {
                    name: "last",
                    type: "input",
                    message: "Update last name"
                },
                {
                    name: "roleId",
                    type: "input",
                    message: "Update Role ID"
                },
                {
                    name: "manId",
                    type: "input",
                    message: "Update Manager ID"
                }
            ])
            .then(function(answer) {
                connection.query("UPDATE employee SET ? WHERE ?", [
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.roleId,
                        manager_id: answer.manId
                    },
                    {
                        id: answer.id
                    }
                ])
                viewEmps();
            })
}
 // This function shows all current roles within the University 
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
// This function allows the user to add a role to the University
// Then the user is returned to view all the roles
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
  // This function allows the user to view all departments within the University
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
// This function allows the user to add a new department to the University
// Then the user is returned to view the departments
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


  