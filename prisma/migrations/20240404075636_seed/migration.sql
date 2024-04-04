-- Seed script for creating 50 employees

-- Drop the table if it exists
DROP TABLE IF EXISTS "employee";

-- Create the table
CREATE TABLE "employee" (
    "emp_no" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("emp_no")
);

-- Insert 50 employees
INSERT INTO "employee" ("first_name", "last_name") VALUES
    ('John', 'Doe'),
    ('Jane', 'Smith'),
    ('Michael', 'Johnson'),
    ('Emily', 'Brown'),
    ('Christopher', 'Wilson'),
    ('Jessica', 'Martinez'),
    ('Matthew', 'Anderson'),
    ('Amanda', 'Taylor'),
    ('David', 'Thomas'),
    ('Sarah', 'Hernandez'),
    ('James', 'Moore'),
    ('Jennifer', 'Martin'),
    ('Daniel', 'Jackson'),
    ('Linda', 'White'),
    ('Robert', 'Harris'),
    ('Karen', 'Clark'),
    ('William', 'Lewis'),
    ('Nicole', 'Robinson'),
    ('Joseph', 'Walker'),
    ('Michelle', 'Perez'),
    ('Richard', 'Hall'),
    ('Ashley', 'Young'),
    ('Charles', 'Allen'),
    ('Kimberly', 'King'),
    ('Thomas', 'Wright'),
    ('Mary', 'Lopez'),
    ('Patricia', 'Scott'),
    ('Steven', 'Green'),
    ('Laura', 'Adams'),
    ('Mark', 'Baker'),
    ('Stephanie', 'Gonzalez'),
    ('Timothy', 'Nelson'),
    ('Heather', 'Carter'),
    ('Brian', 'Evans'),
    ('Rebecca', 'Hill'),
    ('Kevin', 'Mitchell'),
    ('Elizabeth', 'Roberts'),
    ('Ronald', 'Turner'),
    ('Rachel', 'Phillips'),
    ('Jason', 'Campbell'),
    ('Melissa', 'Parker'),
    ('Eric', 'Edwards'),
    ('Samantha', 'Collins'),
    ('Jeffrey', 'Stewart'),
    ('Tiffany', 'Morris'),
    ('Ryan', 'Rogers'),
    ('Angela', 'Cook'),
    ('Gregory', 'Murphy'),
    ('Amy', 'Rivera');

-- Display the inserted employees
SELECT * FROM "employee";
