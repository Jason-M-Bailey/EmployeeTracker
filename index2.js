const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let rolesArray = [];

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_tracker_db",
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  console.log("*****");
  console.log("Lets view all employees to get started");
  console.log("*****");
  viewAllEmployees();
});

const allOptions = () => {
  inquirer
    .prompt([
      {
        name: "select_option",
        type: "list",
        message: "what would you like to do next:",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "View All Departments",
          "View All Roles",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Remove Department",
          "Remove Employee",
          "Remove Role",
          "Update Employee Role",
          "Update Employee's Manager",
          "Exit",
        ],
      },
    ])

    .then((answer) => {
      if (answer.select_option === "View All Employees") {
        viewAllEmployees();
      } else if (answer.select_option === "View All Employees By Department") {
        viewAllEmployeesByDept();
      } else if (answer.select_option === "View All Employees By Manager") {
        viewAllEmployeesByManager();
      } else if (answer.select_option === "View All Departments") {
        viewAllDepartments();
      } else if (answer.select_option === "Add Department") {
        addDepartment();
      } else if (answer.select_option === "Add Employee") {
        addEmployee();
      } else if (answer.select_option === "Remove Employee") {
        removeEmployee();
      } else if (answer.select_option === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.select_option === "Update Employee's Manager") {
        updateEmployeesManager();
      } else if (answer.select_option === "View All Roles") {
        viewAllRoles();
      } else if (answer.select_option === "Add Role") {
        addRole();
      } else if (answer.select_option === "Remove Role") {
        removeRole();
      } else if (answer.select_option === "Remove Department") {
        removeDepartment();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

// functional
const viewAllEmployees = () => {
  connection.query(
    "SELECT id, first_name, last_name, employees.role_title, role_salary, department_name, manager FROM employees LEFT JOIN roles ON employees.role_title = roles.role_title LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

// functional
const viewAllEmployeesByDept = () => {
  connection.query(
    "SELECT department_name, first_name, last_name FROM departments LEFT JOIN roles ON departments.department_id = roles.department_id LEFT JOIN employees ON roles.role_title = employees.role_title ORDER BY department_name;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

// functional
const viewAllEmployeesByManager = () => {
  connection.query(
    "SELECT manager, first_name, last_name FROM departments LEFT JOIN roles ON departments.department_id = roles.department_id LEFT JOIN employees ON roles.role_title = employees.role_title ORDER BY manager;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

// list is static bc there is no option to add new department, consider adding once all requirements are met
// todo: create dynamic array to display
const viewAllDepartments = () => {
  connection.query(
    "SELECT * FROM departments ORDER BY department_id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

// functional
const viewAllRoles = () => {
  connection.query("SELECT * FROM roles ORDER BY role_id", (err, res) => {
    console.table(res);
    allOptions();
  });
};

// functional
class NewDepartmentInfo {
  constructor(new_department_id, new_department_name, new_department_manager) {
    if (!(this instanceof NewDepartmentInfo)) {
      return new NewDepartmentInfo(department_id, department_name, manager);
    }

    this.department_id = new_department_id;
    this.department_name = new_department_name;
    this.manager = new_department_manager;
  }
}

// functional
// todo: check department_id against existing id so no duplicates allowed
// todo: create managerArray for list with addNewManager() as final option
// todo: capitalize first letter, lowercase rest
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "new_department_id",
        type: "input",
        message: "give the new department a unique id:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },

      {
        name: "new_department_name",
        type: "input",
        message: "what is the name of the new department:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },

      {
        name: "new_department_manager",
        type: "input",
        message: "who is the manager for this new department:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
    ])

    .then(function (user) {
      var newDepartment = new NewDepartmentInfo(
        user.new_department_id,
        user.new_department_name,
        user.new_department_manager
      );

      connection.query(
        "INSERT INTO departments SET ?",
        newDepartment,
        function (err, res) {
          if (err) throw err;
          console.log("new department added to database");
          console.log("");
          allOptions();
        }
      );
    });
};

// functional
class NewEmployeeInfo {
  // constructor elements are based off inquirer prompts
  constructor(employee_first_name, employee_last_name, employee_role_title) {
    if (!(this instanceof NewEmployeeInfo)) {
      // based on the mySQL schema
      return new NewEmployeeInfo(first_name, last_name, role_title);
    }

    // this . [mysql spelling] = [inquirer prompt spelling]
    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
    this.role_title = employee_role_title;
  }
}

// functional
// todo: insert addRole() as final option
// todo: capitalize first letter, lowercase rest
const addEmployee = () => {
  //   let rolesArray = [];
  connection.query("SELECT role_title FROM roles", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].role_title);
    }
  });

  inquirer
    .prompt([
      {
        name: "employee_first_name",
        type: "input",
        message: "what is the employee's first name:",
        // splice first letter .toUpperCase then .join
        // function capitalizeFirstLetter(string) {return string.charAt(0).toUpperCase() + string.slice(1);}
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "employee_last_name",
        type: "input",
        message: "what is the employee's last name:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "employee_role_title",
        type: "list",
        message: "select the employee's role:",
        choices: rolesArray,
      },
    ])
    .then(function (user) {
      var newEmployee = new NewEmployeeInfo(
        // inquirer prompts

        user.employee_first_name,
        user.employee_last_name,
        user.employee_role_title
      );
      connection.query(
        "INSERT INTO employees SET ?",
        newEmployee,
        function (err, res) {
          if (err) throw err;
          console.log("new employee added to database");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });
};

// functional
class newRoleInfo {
  // should be same as inquirer prompt names
  constructor(newRole_id, newRole_title, newRole_salary, newRole_department) {
    if (!(this instanceof newRoleInfo)) {
      return new newRoleInfo(role_id, role_title, role_salary, department_id);
    }
    this.role_id = newRole_id;
    this.role_title = newRole_title;
    this.role_salary = newRole_salary;
    this.department_id = newRole_department;
  }
}

// functional
// todo: improve role_id = no duplicates
// todo: capitalize first letter, lowercase rest
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "newRole_id",
        type: "input",
        message: "give the role a unique id:",
        // validate: check against current id #s and return error ir already exists
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },
      {
        name: "newRole_title",
        type: "input",
        message: "what is the title of the role:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
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
        name: "newRole_department",
        type: "input",
        message: "what is the department id:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },
    ])
    .then(function (user) {
      var newRole = new newRoleInfo(
        user.newRole_id,
        user.newRole_title,
        user.newRole_salary,
        user.newRole_department
      );
      connection.query("INSERT INTO roles SET ?", newRole, function (err, res) {
        if (err) throw err;
        console.log("new role added");
        console.log("*****");
        allOptions();
      });
    });
};

// functional
// todo: improve removeDepartment by selecting from a dynamic list
const removeDepartment = () => {
  inquirer
    .prompt([
      {
        name: "remove_department",
        type: "input",
        message: "enter department id to remove:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM departments WHERE department_id = ?",
        answer.remove_department,
        (err, res) => {
          console.log("department removed");
          viewAllDepartments();
        }
      );
    });
};

// functional - remove employee by id instead of list
const removeEmployee = () => {
  console.log("remove employee option chosen");
  inquirer
    .prompt([
      {
        name: "select_employee",
        type: "input",
        message: "enter employee id to remove:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "id must be a number greater than zero";
        },
      },
    ])

    .then((answer) => {
      connection.query(
        "DELETE FROM employees WHERE id = ?",
        answer.select_employee,
        (err, res) => {
          console.log("employee removed");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });
};

// functional - remove role by entering ID number
// todo: improve remove role by selecting from a dynamic list
const removeRole = () => {
  connection.query("SELECT * FROM roles ", (err, res) => {
    console.table(res);
  });

  inquirer
    .prompt([
      {
        name: "employee_role_id",
        type: "input",
        message: "enter role id to remove:",
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM roles WHERE role_id = ?",
        answer.employee_role_id,
        (err, res) => {
          console.log("role removed");
          viewAllRoles();
        }
      );
    });
};

// functional
// todo: create employee list array for dynamic choice
const updateEmployeeRole = () => {
  let rolesArray = [];

  connection.query("SELECT role_title FROM roles", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].role_title);
    }
  });

  inquirer
    .prompt([
      {
        name: "enter_employee_id",
        type: "input",
        message: "enter employee id to update role:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "new_employee_role",
        type: "list",
        message: "select new role:",
        choices: rolesArray,
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employees SET role_title = ? WHERE id = ?;",
        [answer.new_employee_role, answer.enter_employee_id],
        (err, res) => {
          console.log("employee updated");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });
};

// NOT FUNCTIONAL
const updateEmployeesManager = () => {};
