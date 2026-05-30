import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import {getAllOrganizations} from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {

    const projects = await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
    );

    const title = 'Upcoming Service Projects';

    res.render('projects', {
        title,
        projects
    });
};

const showProjectDetailsPage = async (req, res) => {

    const id = req.params.id;

    const project = await getProjectDetails(id);

    res.render('project', {
        title: project.title,
        project
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be 3–200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description too long'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location too long'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Invalid organization')
];

const showEditProjectForm = async (req, res) => {

    const id = req.params.id;

    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();

    res.render('edit-project', {
        title: 'Edit Service Project',
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {

    const id = req.params.id;

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    await updateProject(
        id,
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${id}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};