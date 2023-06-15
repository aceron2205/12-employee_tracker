USE employees_db;

-- Insert departments --
INSERT IGNORE INTO department (department_id, department_name)
VALUES 
    (1, 'Engineering'),
    (2, 'Finance'),
    (3, 'Legal'),
    (4, 'Sales'),
    (5, 'Service'),
    (6, 'HR');

-- Insert roles --
INSERT INTO role (role_id, title, salary, department_id)
VALUES 
    (1, 'Salesman', 8000.00, 4),
    (2, 'Senior Engineer', 4000.00, 1),
    (3, 'Product Manager', 8000.00, 1),
    (4, 'Junior Engineer', 4000.00, 1),
    (5, 'Accountant', 4000.00, 2),
    (6, 'Comptroller', 8000.00, 2),
    (7, 'Lawyer', 4000.00, 3),
    (8, 'Paralegal', 40000, 3),
    (9, 'HR Manager', 4000.00, 6),
    (10, 'HR Assistant', 4000.00, 6);

-- Insert employees --
INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES 
    (1, 'Elizabeth', 'Jones', 9, NULL),
    (2, 'Mike', 'Sanchez', 6, NULL),
    (3, 'Austreberto', 'Gomez', 2, 3),
    (4, 'William', 'Hamilton', 4, 3),
    (5, 'Jasper', 'Alexander', 8, 7),
    (6, 'Cesar', 'Gonzalez', 5, 6);