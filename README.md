# Employee-Tracker

## Summary
This is a terminal based project that allows users to manage a databse of employees based on their roles, budgests, salatries, departments, managers etc. after answering inquirer based prompts in the terminal.

## Video Link To View Process
https://youtu.be/GoqQiboE4QQ

## Screenshot Of Initial Prompts
<img width="704" alt="Screenshot 2021-10-23 at 20 01 02" src="https://user-images.githubusercontent.com/75599021/138578577-8aa3be98-cad2-4f1c-8e6f-c72bf193533f.png">

## Built With
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Node.js](https://nodejs.org/en/docs/)
* [NPM-Library](https://docs.npmjs.com/)
* [Expres.js](https://expressjs.com/)

## Installation Steps
1. First open Terminal.
2. Navigate to repo file.
3. enter in Terminal "npm install" in order to install all dependecies (inquirer, express, mysql2).
4. Start the prompt generation by running "node app.js" within your Terminal.
6. After each question is answered, you will be able to view the edits that you made within your database using mysql workbench.

## Code Snippet Of How To Add A Department
```javascript
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
            console.log(`\n Department "${response.addDepartment}" succesfully added to departments \n`)
            init()
        })
    })
}
```

## Author

* **Mehdi Safari**

- [Link to Portfolio Site](https://mehdisafari77.github.io/Basic-Bio/)
- [Link to Github](https://github.com/mehdisafari77)
- [Link to LinkedIn](https://www.linkedin.com/in/mehdi-safari-992799142/)
