# Employee Tracker

A command line application to view, add, remove and update a company's employees. This application utilizes Node.js, Inquirer and MySQL, and is written with JavaScript. 



[Click here for a video of the application](https://drive.google.com/file/d/16CjCao6ebJ8msy_ugo3jNof7JHTumpqE/view)

## Design

The database schema contains three tables:

![Database Schema](Assets/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
  

## USER STORY

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```
