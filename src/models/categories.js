import db from './db.js'

const getAllCategories = async () => {

    const query = `
        SELECT category_id, name
        FROM categories
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryDetails = async (id) => {

    const query = `
        SELECT category_id, name
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const getProjectsByCategory = async (id) => {

    const query = `
        SELECT
            sp.project_id,
            sp.title
        FROM service_projects sp
        JOIN project_categories pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query, [id]);

    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {

    const query = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2)
    `;

    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {

    // 1. remove existing assignments
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // 2. add new assignments
    if (!categoryIds) return;

    // ensure it's always an array
    const ids = Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds];

    for (const categoryId of ids) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const getCategoriesByServiceProjectId = async (projectId) => {

    const query = `
        SELECT c.category_id, c.name
        FROM categories c
        JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

const createCategory = async (name) => {

    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    return result.rows[0].category_id;
};

const updateCategory = async (id, name) => {

    const query = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [name, id]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory,
    updateCategoryAssignments,
    getCategoriesByServiceProjectId,
    createCategory,
    updateCategory
};