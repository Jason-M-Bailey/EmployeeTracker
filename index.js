const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employeetracker_db",
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  // viewEmployees();
  allOptions();
});

// functional
const allOptions = () => {
  inquirer
    .prompt([
      {
        name: "select_option",
        type: "list",
        message: "what would you like to do next:",
        choices: ["View", "Add", "Remove", "Update Employee", "Exit"],
      },
    ])

    .then((answer) => {
      if (answer.select_option === "View") {
        view();
      } else if (answer.select_option === "Add") {
        add();
      } else if (answer.select_option === "Remove") {
        remove();
      } else if (answer.select_option === "Update Employee") {
        updateEmployee();
      } else {
        connection.end();
      }
    });
};

// functional
// todo: view by manager needs improvement
const view = () => {
  inquirer
    .prompt([
      {
        name: "view_options",
        type: "list",
        message: "what do you want to view: ",
        choices: [
          "Employees",
          "Employees By Department",
          "Employees By Manager",
          "Departments",
          "Roles",
          "Budget By Department",
        ],
      },
    ])
    .then((answer) => {
      if (answer.view_options === "Employees") {
        viewEmployees();
      } else if (answer.view_options === "Employees By Department") {
        viewEmployeesByDept();
      } else if (answer.view_options === "Employees By Manager") {
        viewEmployeesByManager();
      } else if (answer.view_options === "Departments") {
        viewDepartments();
      } else if (answer.view_options === "Roles") {
        viewRoles();
      } else if (answer.view_options === "Budget By Department") {
        viewBudgetByDepartment();
      }
    });
};

// functional
// todo: how to add comma in the salary field
// mysql > SELECT FORMAT(12332.2,0); -> '12,332'
// https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_format
const viewEmployees = () => {
  connection.query(
    "SELECT employee.id, CONCAT(employee.first_name,  ' ', employee.last_name) AS Name, department.name AS Department, title AS Title, salary AS Salary, CONCAT(Manager.first_name, ' ', Manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS Manager ON employee.manager_id = Manager.id ORDER BY id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

// functional
// todo: update choices to be dynamic
// todo: update tables based on dept chosen
const viewEmployeesByDept = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    const departments = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "view_employees_by_department",
          type: "list",
          message: "which department's employees do you want to view: ",
          choices: departments,
        },
      ])
      .then((answer) => {
        connection.query(
          "SELECT CONCAT(first_name,  ' ', last_name) AS Name, department.name AS Department, title AS Title, salary AS Salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department_id = ?;",
          answer.view_employees_by_department,
          (err, res) => {
            console.table(res);
            allOptions();
          }
        );
      });
  });

  //
  // THIS WORKS BUT ITS NOT PRETTY
  //
  // inquirer
  //   .prompt([
  //     {
  //       name: "select_a_department_please",
  //       type: "list",
  //       message: "which dept: ",
  //       choices: ["Admin", "Engineering", "Legal", "Sales"],
  //     },
  //   ])

  //   .then((answer) => {
  //     if (answer.select_a_department_please === "Admin") {
  //       viewAdminDeptEmployees();
  //     } else if (answer.select_a_department_please === "Engineering") {
  //       viewEngineeringDeptEmployees();
  //     } else if (answer.select_a_department_please === "Legal") {
  //       viewLegalDeptEmployees();
  //     } else viewSalesDeptEmployees();
  //   });
  //
  // END OF WORKING FUNCTION
};

// functional
// todo: check mysql with the table created called Manager
const viewEmployeesByManager = () => {
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.manager_id;",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// functional
const viewDepartments = () => {
  connection.query("SELECT * FROM department;", (err, res) => {
    console.table(res);
    allOptions();
  });
};

// functional
const viewRoles = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
    console.table(res);
    allOptions();
  });
};

// functional
const viewBudgetByDepartment = () => {
  connection.query(
    "SELECT department.name, SUM(salary) AS Budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department_id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

//
const add = () => {
  inquirer
    .prompt([
      {
        name: "add_options",
        type: "list",
        message: "what do you want to add: ",
        choices: ["Department", "Employee", "Role"],
      },
    ])
    .then((answer) => {
      if (answer.add_options === "Department") {
        addDepartment();
      } else if (answer.add_options === "Employee") {
        addEmployee();
      } else addRole();
    });
};

// functional
class NewDepartmentInfo {
  // constructor elements are based off inquirer prompts
  constructor(new_department_name) {
    if (!(this instanceof NewDepartmentInfo)) {
      // based on the mySQL schema
      return new NewDepartmentInfo(name);
    }
    // this . [mysql spelling] = [inquirer prompt spelling]
    this.name = new_department_name;
  }
}

// functional
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "new_department_name",
        type: "input",
        message: "what is the name of the new department:",
        validate: (answer) => {
          if (
            answer.match(new RegExp(/^\b[A-Z][a-z]*( [A-Z][a-z]*)*\b$/)) !==
            null
          ) {
            return true;
          }
          return "Names must be capitalized";
        },
      },
    ])

    .then(function (user) {
      var newDepartment = new NewDepartmentInfo(user.new_department_name);

      connection.query(
        "INSERT INTO department SET ?",
        newDepartment,
        function (err, res) {
          if (err) throw err;
          console.log("new department added to database");
          console.log("");
          viewDepartments();
        }
      );
    });
};

class NewEmployeeInfo {
  // constructor elements are based off inquirer prompts
  constructor(
    employee_first_name,
    employee_last_name,
    employee_role_id,
    employee_manager_id
  ) {
    if (!(this instanceof NewEmployeeInfo)) {
      // based on the mySQL schema
      return new NewEmployeeInfo(first_name, last_name, role_id, manager_id);
    }

    // this . [mysql spelling] = [inquirer prompt spelling]
    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
    this.role_id = employee_role_id;
    this.manager_id = employee_manager_id;
  }
}

// functional
const addEmployee = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
    const roles = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    connection.query("SELECT * FROM employee;", (err, res) => {
      const employees = res.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });

      inquirer
        .prompt([
          {
            name: "employee_first_name",
            type: "input",
            message: "what is the employee's first name:",
            validate: (answer) => {
              if (
                answer.match(new RegExp(/^\b[A-Z][a-z]*( [A-Z][a-z]*)*\b$/)) !==
                null
              ) {
                return true;
              }
              return "Names must be capitalized";
            },
          },
          {
            name: "employee_last_name",
            type: "input",
            message: "what is the employee's last name:",
            validate: (answer) => {
              if (
                answer.match(new RegExp(/^\b[A-Z][a-z]*( [A-Z][a-z]*)*\b$/)) !==
                null
              ) {
                return true;
              }
              return "Names must be capitalized";
            },
          },
          {
            name: "employee_role_id",
            type: "list",
            message: "what is the employee's role:",
            choices: roles,
          },
          {
            name: "employee_manager_id",
            type: "list",
            message: "choose with employee is their manager: ",
            choices: employees,
          },
        ])
        .then(function (user) {
          var newEmployee = new NewEmployeeInfo(
            // inquirer prompt names
            user.employee_first_name,
            user.employee_last_name,
            user.employee_role_id,
            user.employee_manager_id
          );
          connection.query(
            "INSERT INTO employee SET ?",
            newEmployee,
            function (err, res) {
              if (err) throw err;
              console.log("new employee added to database");
              console.log("*****");
              viewEmployees();
            }
          );
        });
    });
  });
};

class NewRoleInfo {
  // inquirer prompt spelling
  constructor(newRole_title, newRole_salary, newRole_department_id) {
    if (!(this instanceof NewRoleInfo)) {
      // mysql schema spelling
      return new newRoleInfo(title, salary, department_id);
    }
    // this . [mysql spelling] = [inquirer prompt spelling]
    this.title = newRole_title;
    this.salary = newRole_salary;
    this.department_id = newRole_department_id;
  }
}

// functional
const addRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    const departments = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "newRole_title",
          type: "input",
          message: "what is the title of the role:",
          validate: (answer) => {
            if (
              answer.match(new RegExp(/^\b[A-Z][a-z]*( [A-Z][a-z]*)*\b$/)) !==
              null
            ) {
              return true;
            }
            return "Names must be capitalized";
          },
        },
        {
          name: "newRole_salary",
          type: "input",
          message: "what is the salary for the role:",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return "salaries must be a number greater than zero";
          },
        },
        {
          name: "newRole_department_id",
          type: "list",
          message: "which department: ",
          choices: departments,
        },
      ])
      .then(function (user) {
        var newRole = new NewRoleInfo(
          // inquirer prompt names
          user.newRole_title,
          user.newRole_salary,
          user.newRole_department_id
        );
        connection.query(
          "INSERT INTO role SET ?",
          newRole,
          function (err, res) {
            if (err) throw err;
            viewRoles();
          }
        );
      });
  });
};

const remove = () => {
  inquirer
    .prompt([
      {
        name: "remove_options",
        type: "list",
        message: "what do you want to remove: ",
        choices: ["Department", "Employee", "Role"],
      },
    ])
    .then((answer) => {
      if (answer.remove_options === "Department") {
        removeDepartment();
      } else if (answer.remove_options === "Employee") {
        removeEmployee();
      } else removeRole();
    });
};

// functional - remove by id
const removeDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    const departments = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "remove_department",
          type: "list",
          message: "which department do you want to remove: ",
          choices: departments,
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM department WHERE id = ?",
          answer.remove_department,
          (err, res) => {
            viewDepartments();
          }
        );
      });
  });
};

// functional - remove by id
const removeEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    const employees = res.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "remove_employee",
          type: "list",
          message: "which employee do you want to remove: ",
          choices: employees,
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          answer.remove_employee,
          (err, res) => {
            viewEmployees();
          }
        );
      });
  });
};

// functional - remove by id
// todo: improve functionality by removing from dynamic list
const removeRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    const roles = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "remove_role",
          type: "list",
          message: "which role do you want to remove: ",
          choices: roles,
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM role WHERE id = ?",
          answer.remove_role,
          (err, res) => {
            viewRoles();
          }
        );
      });
  });
};

// functional
const updateEmployee = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
    const roles = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    connection.query("SELECT * FROM employee;", (err, res) => {
      const employees = res.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });

      inquirer
        .prompt([
          {
            name: "pick_employee",
            type: "list",
            message: "which employee do you want to update: ",
            choices: employees,
          },
          {
            name: "new_role",
            type: "list",
            message: "what is their new role: ",
            choices: roles,
          },
          {
            name: "new_manager",
            type: "list",
            message: "who is their manager: ",
            choices: employees,
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?",
            [answer.new_role, answer.new_manager, answer.pick_employee],
            (err, res) => {
              viewEmployees();
            }
          );
        });
    });
  });
};
