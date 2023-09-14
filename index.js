const { connection } = require('./db/connection')
const inquirer = require('inquirer');
const cTable = "console.table"

function init(){
    inquirer.prompt({
        name:"test",
        type: "list",
        message: "Welcome to an SQL Employee tracker, Select what you'd like to do below.",
        choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update Employee Role",
            "Exit",
        ],
    })
    .then ((res) => {
        let choice = res.action;
        switch (choice) {
            case "View Departments":departmentsPage();
            break;
            case "View Roles":rolesPage();
            break;
            case "View Employees":employeesPage();
            break;
            case "Add a Department":addDepartment();
            break;
            case "Add a Role":addRole();
            break;
            case "Add an Employee":addEmployee();
            break;
            case "Update Employee Role":updateEmployeeRole();
            break;
            case "Quit": connection.end();
            break;
        }
    });
    function departmentsPage() {
        setTimeout(() => {
            let query = "SELECT * FROM department";
            connection.query(query, function (err, res){
                if (err) throw err;
                {
                    console.table(res)
                }
                init()
            });
        }, 1000);
    }
    function rolesPage() {
        setTimeout(() => {
            let query = "SELECT * FROM roles";
            connection.query(query, function (err, res) {
                if (err) throw err;
                {
                    console.table(res);
                }
                init();
            });
        }, 1000);
    }
    function employeesPage() {
        setTimeout(() => {
            let query = "SELECT * FROM employee";
            connection.query(query, function (err, res){
                if (err) throw err;
                {
                    console.table(res);
                }
                init();
            });
        }, 1000);
    }
    function addDepartment() {
        connection.query(`SELECT * FROM department`, (err, res) => {
            if (err) throw err;
            console.table(res);
        });
        setTimeout(() => {
            inquirer.prompt([
                {
                    name: "departmentName",
                    type: "input",
                    message: "Which department would you like to look at?"
                },
            ])
            .then((answer) => {
                connection.query(
                  "INSERT INTO department SET ?",
                  {
                    name: answer.departmentName,
                  },
                  function (err) {
                    if (err) {
                      throw err;
                    } else {
                      let query = "SELECT * FROM department";
                      connection.query(query, function (err, res) {
                        if (err) throw err;
                        {
                          console.table(res);
                        }
                        init();
                      });
                    }
                  }
                );
              });
          }, 1000);
        }
        function addRole(){
            connection.query(
                `SELECT department.id AS "Dept ID", department.name AS "Dept Name", title AS "Role Title", salary, department_id AS "Role Table Department ID"
                    FROM department
                    LEFT JOIN roles r 
                    ON department.id = department_id;`,
                (err, res) => {
                  if (err) throw err;
                  console.table(res);
                }
              );
              setTimeout(() => {
                inquirer
                  .prompt([
                    {
                      name: "roleTitle",
                      type: "input",
                      message: "What is the role title",
                    },
          
                    {
                      name: "roleSalary",
                      type: "input",
                      message: "What is the role's salary",
                    },
                    {
                      name: "departmentId",
                      type: "input",
                      message: "What is the role's department id?",
                    },
                  ])
                  .then(function (answer) {
                    connection.query(
                      "INSERT INTO roles SET ?",
                      {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        department_id: answer.departmentId,
                      },
                      function (err) {
                        if (err) {
                          throw err;
                        } else {
                          let query = `SELECT * FROM roles`;
                          connection.query(query, function (err, res) {
                            if (err) throw err;
                            {
                              console.table(res);
                            }
                            init();
                          });
                        }
                      }
                    );
                  });
              }, 1000);
          }
              function addEmployee() {
                connection.query(
                  `SELECT r.id AS 'Role Id', title AS Title, CONCAT(first_name," ",last_name) AS Name, e.id AS 'Id #'
                        FROM roles r
                        LEFT JOIN employee e
                        ON e.role_id = r.id;`,
                  (err, res) => {
                    if (err) throw err;
                    console.table(res);
                  }
                );
                setTimeout(() => {
                  inquirer
                    .prompt([
                      {
                        name: "isManager",
                        type: "confirm",
                        message: "Is the employee being added a manager?",
                      },
          
                      {
                        name: "employeeFirst",
                        type: "input",
                        message: "What is your employee's first name?",
                      },
                      {
                        name: "employeeLast",
                        type: "input",
                        message: "What is your employee's last name?",
                      },
                      {
                        name: "employeeRoleId",
                        type: "input",
                        message: "What is the employee's role id?",
                      },
                      {
                        name: "managerId",
                        type: "input",
                        message: "What is the employee's manager's id?",
                        when: (answer) => {
                          return answer.isManager === false;
                        },
                      },
                    ])
                    .then(function (answer) {
                      connection.query(
                        "INSERT INTO employee SET ?",
                        {
                          first_name: answer.employeeFirst,
                          last_name: answer.employeeLast,
                          role_id: answer.employeeRoleId,
                          manager_id: answer.managerId,
                        },
                        function (err) {
                          if (err) {
                            throw err;
                          } else {
                            let query = `SELECT r.id AS 'Role Id', title AS Title, CONCAT(first_name," ",last_name) AS Name, e.id AS 'Id #'
                              FROM roles r
                              LEFT JOIN employee e
                              ON e.role_id = r.id;`;
                            connection.query(query, function (err, res) {
                              if (err) throw err;
                              {
                                console.table(res);
                              }
                              init();
                            });
                          }
                        }
                      );
                    });
                }, 1000);
              }
              function updateEmployeeRole(){
                  connection.query(
                      `SELECT r.id AS 'Role Id', title AS Title, CONCAT(first_name," ",last_name) AS Name, e.id AS 'Id #'
                      FROM roles r
                      LEFT JOIN employee e
                      ON e.role_id = r.id;`,
                      (err, res) => {
                        if (err) throw err;
                        console.table(res);
                      }
                    );
                    setTimeout(() => {
                      inquirer
                        .prompt([
                          {
                            name: "employeeID",
                            type: "input",
                            message: "What is the employee's id?",
                          },
                
                          {
                            name: "updateEmployeeRole",
                            type: "input",
                            message: "What is the employee's new role id?",
                          },
                        ])
                        .then((answer) => {
                          connection.query(
                            `UPDATE employee SET role_id  = ${answer.updateEmployeeRole}
                           WHERE id = ${answer.employeeID};`,
                            (err) => {
                              if (err) {
                                throw err;
                              } else {
                                connection.query(
                                  `SELECT r.id AS 'Role Id', title AS Title, CONCAT(first_name," ",last_name) AS Name, e.id AS 'Id #'
                                  FROM roles r
                                  LEFT JOIN employee e
                                  ON e.role_id = r.id;`,
                                  (err, res) => {
                                    if (err) throw err;
                                    console.table(res);
                                    init();
                                  }
                                );
                              }
                            }
                          );
                        });
                    }, 1000);
                  }
}


init();