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
    connectedMesssage()
})

connectedMesssage = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*      THE EMPLOYEE MANAGER       *")
    console.log("*                                 *")
    console.log("***********************************")
    init();
};

// Inquirer prompt with switch case for questions
function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "initial_list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",

                "View employees by department",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
                "View department budgets",
                "No Action"]
        }
    ]).then(response => {
        switch (response.initial_list) {
            case "View all departments":
                viewDepartment()
                break;
            case "View all roles":
                viewRoles()
                break;
            case "View all employees":
                viewEmployees()
                break;
            case "Add a department":
                addDepartment()
                break;
            case "Add a role":
                addRole()
                break;
            case "Add an employee":
                addEmployee()
                break;
            case "Update an employee role":
                updateRole()
                break;

            case "View employees by department":
                viewEmployeesByDepartment()
                break;
            case "Delete a department":
                deleteDepartment()
                break;
            case "Delete a role":
                deleteRole()
                break;
            case "Delete an employee":
                deleteEmployee()
                break;
            case "View department budgets":
                viewDepartmentBudgets()
                break;
            case "No Action":
                connection.end()
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

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartment",
            message: "What is the name of the department that you want to add?"

        }
    ]).then(response => {
        const addDepartment = "INSERT INTO department (name) VALUES (?)";
        db.query(addDepartment, response.addDepartment, (err, res) => {
            if (err) {
                throw err;
            }
            console.log(`Department "${response.addDepartment}" succesfully added to departments `)
            init()
        })
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

            }, function (err) {
                if (err) {
                    throw err
                }
                init()
            })

        })
    })
}


// Add employee function
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        }
    ]).then(response => {
        const params = [response.firstName, response.lastName]

        const selectRole = "SELECT * FROM role";

        db.query(selectRole, (err, res) => {
            if (err) {
                throw err;
            }
            const roles = res.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                }
            ]).then(roleOption => {
                const role = roleOption.role
                params.push(role)

                const selectManager = "SELECT * FROM employee";

                db.query(selectManager, (err, res) => {
                    if (err) {
                        throw err;
                    }
                    const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the manager of this employee?",
                            choices: managers
                        }
                    ]).then(managerOption => {
                        const manager = managerOption.manager;
                        params.push(manager)

                        const insertEmployee = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

                        db.query(insertEmployee, params, (err, res) => {
                            if (err) {
                                throw err;
                            }
                            console.log("New employee has been successfully added!")
                            init();

                        })
                    })

                })
            })

        }) 
    })
}

function updateRole() {
    db.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'employeeUpdate',
                type: 'list',
                message: 'Choose the employee whose role you would like to update.',
                choices: results.map(item => item.first_name)
            },
            ])
            .then((answer) => {
                const updateEmployee = (answer.employeeUpdate)
                db.query("SELECT * FROM role", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: 'role_id',
                                type: 'list',
                                message: 'Select the new role of the employee.',
                                choices: results.map(item => item.title)
                            },
                        ])
                        .then((answer) => {
                            const roleChosen = results.find(item => item.title === answer.role_id)
                            db.query(
                                "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
                                role_id: "" + roleChosen.id + "",
                            },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Successfully updated " + updateEmployee + "'s role to " + answer.role_id + "!");
                                    init();
                                }
                            )
                        })
                })
            })
    })
}



// * Update employee managers.

// * View employees by manager.

// * View employees by department.

// * Delete departments, roles, and employees.

// * View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.