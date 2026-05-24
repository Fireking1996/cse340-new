import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory
} from '../models/categories.js';

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

export {
    showCategoriesPage,
    showCategoryDetailsPage
};