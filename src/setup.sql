CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organizations
(name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(organization_id)
);


INSERT INTO service_projects
(organization_id, title, description, location, project_date)
VALUES

-- BrightFuture Builders (Organization 1)
(1, 'Community Playground Renovation',
 'Renovating playground equipment and installing safer surfaces.',
 'Chicago, IL',
 '2026-06-10'),

(1, 'Affordable Housing Build',
 'Construction of affordable housing units for low-income families.',
 'Aurora, IL',
 '2026-06-15'),

(1, 'Senior Center Repairs',
 'Repairing roofing and accessibility features at a senior center.',
 'Naperville, IL',
 '2026-07-01'),

(1, 'Community Garden Construction',
 'Building raised beds and irrigation systems for a community garden.',
 'Joliet, IL',
 '2026-07-12'),

(1, 'School Renovation Project',
 'Updating classrooms and installing energy-efficient lighting.',
 'Elgin, IL',
 '2026-08-03'),

-- GreenHarvest Growers (Organization 2)
(2, 'Urban Garden Workshop',
 'Teaching residents how to grow vegetables in urban spaces.',
 'Oak Lawn, IL',
 '2026-06-11'),

(2, 'Neighborhood Tree Planting',
 'Planting trees to improve local air quality and green spaces.',
 'Chicago, IL',
 '2026-06-20'),

(2, 'Youth Farming Camp',
 'Educational summer camp focused on sustainable agriculture.',
 'Evanston, IL',
 '2026-07-05'),

(2, 'Farmers Market Outreach',
 'Providing fresh produce and sustainability education.',
 'Bolingbrook, IL',
 '2026-07-18'),

(2, 'Community Compost Initiative',
 'Setting up compost collection and education stations.',
 'Schaumburg, IL',
 '2026-08-08'),

-- UnityServe Volunteers (Organization 3)
(3, 'Food Pantry Assistance',
 'Organizing and distributing food donations to families.',
 'Chicago, IL',
 '2026-06-09'),

(3, 'Back-to-School Supply Drive',
 'Collecting and distributing school supplies to students.',
 'Oak Lawn, IL',
 '2026-07-22'),

(3, 'Holiday Meal Program',
 'Preparing meals for families during the holiday season.',
 'Tinley Park, IL',
 '2026-11-20'),

(3, 'Community Clothing Giveaway',
 'Sorting and distributing donated clothing items.',
 'Orland Park, IL',
 '2026-09-14'),

(3, 'Local Charity Support Day',
 'Volunteers assisting multiple local nonprofit organizations.',
 'Bridgeview, IL',
 '2026-10-05');

 CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO categories (name)
VALUES
('Community Development'),
('Environmental Sustainability'),
('Volunteer Services');

INSERT INTO project_categories (project_id, category_id)
VALUES

-- Community Development
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),

-- Environmental Sustainability
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),

-- Volunteer Services
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_volunteers (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id),

    FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);