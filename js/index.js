const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees_db",
});

function init() {
  console.log("Initializing...");
  runQuestions();
}

module.exports = init;

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to employees_db database.");
});

function runQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "startQuestions",
        message: "Which is better?",
        choices: [
          "View All Employees",
          "Add Employee",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.startQuestions) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        // case "Quit":
        //     connection.end();
        //     break;
      }
    });
}

function viewAllEmployees() {
  const query = `
    SELECT 
      e.first_name AS 'First Name', 
      e.last_name AS 'Last Name', 
      role.title AS 'Job Title', 
      department.department_name AS 'Department', 
      CONCAT('$', FORMAT(role.salary, 2)) AS 'Salary', 
      CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' 
    FROM 
      employee e
    LEFT JOIN 
      role ON e.role_id = role.role_id 
    LEFT JOIN 
      department ON role.department_id = department.department_id 
    LEFT JOIN 
      employee m ON e.manager_id = m.employee_id;
  `;

  db.query(query, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n");
    runQuestions();
  });
}

function viewAllRoles() {
  const query = `
    SELECT 
        role.role_id, 
        role.title, 
        CONCAT('$', FORMAT(role.salary, 2)) AS salary,
        department.department_name 
    FROM role
    JOIN department ON role.department_id = department.department_id
  `;

  db.query(query, function (err, results) {
    if (err) {
      console.error("Error fetching roles:", err);
      return;
    }

    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n");
    runQuestions();
  });
}

function viewAllDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n");
    runQuestions();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Please add the name of the new Department",
      },
    ])
    .then((answer) => {
      const departmentName = answer.newDepartment;
      const query =
        "INSERT IGNORE INTO department(department_name) VALUES (?);";

      db.query(query, [departmentName], (err, results) => {
        if (err) {
          console.log("An error occured:", err);
          runQuestions();
          return;
        }

        if (results.affectedRows === 0) {
          console.log(`${departmentName} already exists.`);
        } else {
          console.log(`${departmentName} was added successfully`);
        }

        runQuestions();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Please add the name of the new Role",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "roleDpt",
        message: "To which department it belongs?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service", "HR"],
      },
    ])
    .then((answer) => {
      const { roleName, roleSalary, roleDpt } = answer;

      const query =
        "INSERT IGNORE INTO role(title, salary, department_id) VALUES (?, ?, ?);";
      db.query(query, [roleName, roleSalary, roleDpt], (err, results) => {
        if (err) {
          console.log("An error occurred:", err);
          runQuestions();
          return;
        }

        if (results.affectedRows === 0) {
          console.log(`${roleName} already exists.`);
        } else {
          console.log(
            `${roleName} was successfully added with a salary of $${roleSalary} in the ${roleDpt} department.`
          );
        }

        runQuestions();
      });
    });
}

function addEmployee() {
  let roleChoices = [];
  let managerChoices = [];

  db.query("SELECT role_id, title FROM role", (err, roleResults) => {
    if (err) {
      console.error("Error fetching roles:", err);
      return;
    }

    roleChoices = roleResults.map((role) => ({
      name: role.title,
      value: role.role_id,
    }));

    db.query(
      "SELECT employee_id, first_name, last_name FROM employee",
      (err, employeeResults) => {
        if (err) {
          console.error("Error fetching employees:", err);
          return;
        }

        managerChoices = [
          { name: "None", value: null },
          ...employeeResults.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id,
          })),
        ];

        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "Enter the first name of the employee:",
            },
            {
              type: "input",
              name: "last_name",
              message: "Enter the last name of the employee:",
            },
            {
              type: "list",
              name: "role_id",
              message: "Select the role of the employee:",
              choices: roleChoices,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Select the manager of the employee:",
              choices: managerChoices,
            },
          ])
          .then((answer) => {
            const { first_name, last_name, role_id, manager_id } = answer;
            const values = [first_name, last_name, role_id, manager_id];
            const query =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

            db.query(query, values, (error, results) => {
              if (error) {
                console.error(
                  "Error occurred while adding the employee:",
                  error
                );
                return runQuestions();
              }
              console.log(
                `New employee, ${first_name} ${last_name}, has been added successfully!`
              );
              runQuestions();
            });
          });
      }
    );
  });
}
