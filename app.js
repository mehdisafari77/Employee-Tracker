const mysql = require('mysql2');
const inquirer = require('inquirer');
const Connection = require('mysql2/typings/mysql/lib/Connection');


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

db.connect(err => {
    if (err) {
        throw err
    }
    init()
})

  // Inquirer prompt with switch case for questions
    function init() {
        inquirer.prompt([
            {
                type: "list",
                name: "initial_list",
                message: "What would you like to do?",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
            }
        ]).then(response => {
            switch (response.initial_list) {
                case "view all departments": 
                viewDepartment()
                break;
                case "view all roles": 
                viewRoles()
                break;
                case "view all employees": 
                viewEmployees()
                break;
                case "add a department": 
                addDepartment()
                break;
                case "add a role": 
                addRole()
                break;
                case "add an employee": 
                addEmployee()
                break;
                case "update an employee role": 
                updateRole()
                break;

            }
        })
    }

  // Create methods that correspond to user switch case choices

