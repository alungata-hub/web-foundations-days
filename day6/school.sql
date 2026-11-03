CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

INSERT INTO students (name, email)
VALUES
    ('Amina Hassan', 'amina@example.com'),
    ('Brian Otieno', 'brian@example.com'),
    ('Carol Wanjiku', 'carol@example.com');
    ('Diana Mwangi', 'diana@example.com');

INSERT INTO courses (course_name)
VALUES
    ('Database Systems'),
    ('Web Development'),
    ('Computer Networks');

INSERT INTO enrolments (student_id, course_id, grade)
VALUES
    (1, 1, 'A'),
    (1, 2, 'B'),
    (2, 1, 'B'),
    (2, 3, 'A'),
    (3, 2, 'A');

SELECT
    students.name AS student_name,
    courses.course_name,
    enrolments.grade
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Amina Hassan';

SELECT
    courses.course_name,
    students.name AS student_name
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Database Systems';

SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

SELECT
    students.student_id,
    students.name
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1
AND course_id = 2;

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
