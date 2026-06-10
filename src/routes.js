import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    removeVolunteerFromProject,
    addVolunteerToProject
 } from './controllers/projects.js';

import { showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js';


const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// error route
router.get('/test-error', testErrorPage);

// organization form
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

router.get('/new-project', showNewProjectForm);

router.post('/new-project',
    projectValidation,
    processNewProjectForm
);

router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

router.get('/edit-project/:id', showEditProjectForm);

router.post('/edit-project/:id', processEditProjectForm);

router.get('/new-category', showNewCategoryForm);

router.post('/new-category', categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', showEditCategoryForm);

router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);

router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

router.get(
    "/users",
    requireRole("admin"),
    showUsersPage
);

router.get(
  '/project/:id/volunteer',
  requireLogin,
  addVolunteerToProject
);

router.get(
  '/project/:id/unvolunteer',
  requireLogin,
  removeVolunteerFromProject
);

export default router;