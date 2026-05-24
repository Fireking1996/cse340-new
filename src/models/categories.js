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

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory
};