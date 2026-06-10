import db from './db.js';

const getAllProjects = async () => {

    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organizations o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {

    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {

    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organizations o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
}

const getProjectDetails = async (id) => {

    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organizations o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
}

const createProject = async (title, description, location, date, organizationId) => {

    const query = `
      INSERT INTO service_projects
      (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
    `;
    await db.query(query, [projectId, userId]);
};

const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2
    `;
    await db.query(query, [projectId, userId]);
};

const getUserVolunteeredProjects = async (userId) => {
    const query = `
        SELECT sp.*
        FROM service_projects sp
        JOIN project_volunteers pv ON sp.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isUserVolunteering = async (projectId, userId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails, 
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    getUserVolunteeredProjects,
    isUserVolunteering
};