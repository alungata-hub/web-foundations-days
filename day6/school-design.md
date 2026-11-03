# School Database Design

## 1. Tables and Their Purposes

### Students Table
Stores information about students, including their unique student ID, name, and email address. Each student has a unique ID and email address.

### Courses Table
Stores information about courses offered by the school. Each course has a unique course ID and course name.

### Enrolments Table
Stores information about students enrolled in courses. It connects students to courses and records each student's grade for a particular course.

## 2. Relationships Between Tables

### Students and Enrolments
This is a one-to-many relationship. One student can have multiple enrolment records because they can take several courses. Each enrolment record belongs to one student.

### Courses and Enrolments
This is also a one-to-many relationship. One course can have multiple students enrolled in it. Each enrolment record belongs to one course.

### Students and Courses
Students and courses have a many-to-many relationship. One student can take multiple courses, and one course can have multiple students.

The enrolments table resolves this many-to-many relationship by acting as a junction table. It connects students and courses using their IDs and stores the grade earned by each student in a particular course.

The junction table is necessary because it allows the database to represent each student-course combination separately and prevents duplicate enrolments through a UNIQUE constraint on student_id and course_id.

## 3. Database Index

I would create an index on the course_id column in the enrolments table.

The index would help the database find enrolment records for a particular course more efficiently. This is useful when retrieving all students enrolled in a specific course or counting the number of students per course.

The SQL statement is:

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

## 4. SQL vs NoSQL

SQL databases store structured data in tables with defined relationships between them. They support primary keys, foreign keys, constraints, and JOIN operations, which help maintain data accuracy and consistency.

NoSQL databases store data using different structures, such as documents or key-value pairs. They offer more flexibility when handling data that does not follow a fixed structure.

For this school database, I would choose SQL because student, course, and enrolment information is structured and has clear relationships. SQL also helps maintain data integrity by preventing duplicate student emails and duplicate enrolments. Its JOIN operations make it easier to retrieve information across the three related tables.

A NoSQL database could be useful for applications that handle large amounts of flexible or unstructured data, but it is not necessary for this particular system.