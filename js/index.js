const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Luna2205!",
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
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n");
    runQuestions();
  });
}

function viewAllRoles() {
  db.query("SELECT * FROM role", function (err, results) {
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
      const { departmentName } = answer.newDepartment;
      db.query(
        `INSERT IGNORE INTO department(department_name) VALUES ("${departmentName}");`,
        (err, results) => {
          if (err) {
            console.log("An error occured, try again.");
          } else {
            if (results && results.length === 0) {
              console.log(`${newDepartment} was added successfully`);
              runQuestions();
            } else {
              console.log(`${newDepartment} already exists.`);
              runQuestions();
            }
          }
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Please add the name of the new Department",
      },

      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
      },

      {
        type: "lists",
        name: "roleDpt",
        message: "To which department it belongs?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service", "HR"],
      },
    ])
    .then((answer) => {
      const { roleName } = answer.newRole;
      db.query(
        `INSERT IGNORE INTO role(role_title) VALUES ("${roleName}");`,
        (err, results) => {
          if (err) {
            console.log("An error occured, try again.");
          } else {
            if (results && results.length === 0) {
              console.log(`${newRole} was successfully added`);
              runQuestions();
            } else {
              console.log(`${newRole} already exists.`);
              runQuestions();
            }
          }
        }
      );

      const { roleSalary } = answer.newSalary;
      db.query(
        `INSERT IGNORE INTO role(role_salary) VALUES ("${roleSalary}");`,
        (err, results) => {
          if (err) {
            console.log("An error occured, try again.");
          } else {
            console.log(`${newSalary} was successfully added`);
            runQuestions();
          }
        }
      );
    });
}

function addEmployee() {
  // Map the title and employee results to arrays of choices
  const titleChoices = titleResults.map((title) => ({
    name: title.title,
    value: title.id,
  }));
  const managerChoices = [
    { name: "None", value: null }, // Option for "None" if the employee will not have a manager
    ...employeeResults.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
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
        name: "title_id",
        message: "Select the title of the employee:",
        choices: titleChoices,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select the manager of the employee:",
        choices: managerChoices,
      },
    ])
    .then((answer) => {
      const { first_name, last_name, title_id, manager_id } = answers;
      const values = [first_name, last_name, title_id, manager_id];
      const query =
        "INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)";

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error occurred while adding the employee:", error);
          runQuestions();
        } else {
          console.log("New employee added:");
          console.log("First Name:", values[0]);
          console.log("Last Name:", values[1]);
          console.log("Title ID:", values[2]);
          console.log("Manager ID:", values[3] || "None");
          runQuestions();
        }
      });
    });
}
