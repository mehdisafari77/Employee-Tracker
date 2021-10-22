const mysql = require('mysql2');
const inquirer = require('inquirer');
const { response } = require('express');

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

  function viewDepartment() {
      db.query('SELECT * FROM department', (err, res) => {
          if (err) {
              throw err
          }
          console.table(res)
          init()
      })
  }

  function viewRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) {
            throw err
        }
        console.table(res)
        init()
    })
}

  function viewEmployees() {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            throw err
        }
        console.table(res)
        init()
    })
}


  function addRole() {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err
        }
        inquirer.prompt([
            {
                type: "input",
                name: "add_role",
                message: "What role will the new employee have?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the employee's salary?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Select department for this role.",
                choices: res.map(department => department.name)
            }
        ]).then(response => {
            const selectedDepartment = res.find(department => department.name === response.department_id)

            db.query('INSERT INTO role SET ?', {
                title: response.add_role,
                salary: response.salary,
                department_id: selectedDepartment.id

            }, function(err) {
                if (err) {
                    throw err
                }
                init()
            })
        
        })
    })
  }