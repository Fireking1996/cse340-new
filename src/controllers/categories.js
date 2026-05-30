import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const showCategoriesPage = async (req, res) => {

    const categories = await getAllCategories();

    const title = 'Service Project Categories';

    res.render('categories', {
        title,
        categories
    });
};

const showCategoryDetailsPage = async (req, res) => {

    const id = req.params.id;

    const category = await getCategoryDetails(id);

    const projects = await getProjectsByCategory(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        project,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;
    const categoryIds = req.body.categories;

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create Category'
    });
};

const processNewCategoryForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    await createCategory(name);

    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {

    const id = req.params.id;

    const category = await getCategoryDetails(id);

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};

const processEditCategoryForm = async (req, res) => {

    const id = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${id}`);
    }

    const { name } = req.body;

    await updateCategory(id, name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${id}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
    };