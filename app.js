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


  