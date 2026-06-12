import { Router } from 'express';
import { query } from '../db/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const platformRouter = Router();

const editableRoles = ['developer', 'owner', 'admin'];

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function projectSelect() {
  return `
    p.*,
    json_build_object(
      'id', owner.id,
      'name', owner.name,
      'title', owner.title,
      'email', owner.email
    ) AS owner,
    COALESCE(
      json_agg(DISTINCT jsonb_build_object('id', member_user.id, 'name', member_user.name, 'title', member_user.title))
      FILTER (WHERE member_user.id IS NOT NULL),
      '[]'
    ) AS members
  `;
}

async function ensureSkills(userId, skillNames, level = 'intermediate') {
  for (const skillName of skillNames) {
    const skill = await query(
      `INSERT INTO skills (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [skillName],
    );

    await query(
      `INSERT INTO user_skills (user_id, skill_id, level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, skill_id) DO UPDATE SET level = EXCLUDED.level`,
      [userId, skill.rows[0].id, level],
    );
  }
}

async function notify(userId, type, title, body, link = null) {
  await query(
    `INSERT INTO notifications (user_id, type, title, body, link)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, type, title, body, link],
  );
}

platformRouter.get('/profiles', async (request, response, next) => {
  try {
    const { skill = '', q = '' } = request.query;
    const result = await query(
      `SELECT u.id, u.name, u.role, u.title, u.bio, u.location, u.avatar_url, u.github_url,
              u.linkedin_url, u.portfolio_url, u.profile_complete,
              COALESCE(json_agg(json_build_object('id', s.id, 'name', s.name, 'level', us.level))
                FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
       FROM users u
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       WHERE ($1 = '' OR s.name::text ILIKE '%' || $1 || '%')
         AND ($2 = '' OR u.name ILIKE '%' || $2 || '%' OR COALESCE(u.title, '') ILIKE '%' || $2 || '%')
       GROUP BY u.id
       ORDER BY u.profile_complete DESC, u.created_at DESC`,
      [skill, q],
    );

    response.json({ profiles: result.rows });
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/profile/me', requireAuth, async (request, response, next) => {
  try {
    const user = await query(
      `SELECT id, name, email, role, title, bio, location, avatar_url, github_url, linkedin_url,
              portfolio_url, profile_complete, created_at
       FROM users WHERE id = $1`,
      [request.user.sub],
    );
    const skills = await query(
      `SELECT s.id, s.name, us.level
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1
       ORDER BY s.name`,
      [request.user.sub],
    );

    response.json({ profile: { ...user.rows[0], skills: skills.rows } });
  } catch (error) {
    next(error);
  }
});

platformRouter.put('/profile/me', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  const { name, title, bio, location, avatarUrl, githubUrl, linkedinUrl, portfolioUrl, skills = [] } = request.body ?? {};

  try {
    const complete = Boolean(name && title && bio && normalizeList(skills).length > 0);
    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           title = $2,
           bio = $3,
           location = $4,
           avatar_url = $5,
           github_url = $6,
           linkedin_url = $7,
           portfolio_url = $8,
           profile_complete = $9,
           updated_at = NOW()
       WHERE id = $10
       RETURNING id, name, email, role, title, bio, location, avatar_url, github_url,
                 linkedin_url, portfolio_url, profile_complete`,
      [name?.trim(), title, bio, location, avatarUrl, githubUrl, linkedinUrl, portfolioUrl, complete, request.user.sub],
    );

    await query('DELETE FROM user_skills WHERE user_id = $1', [request.user.sub]);
    await ensureSkills(request.user.sub, normalizeList(skills));

    const refreshed = await query(
      `SELECT s.id, s.name, us.level FROM user_skills us JOIN skills s ON s.id = us.skill_id WHERE us.user_id = $1`,
      [request.user.sub],
    );

    response.json({ profile: { ...result.rows[0], skills: refreshed.rows } });
  } catch (error) {
    next(error);
  }
});

platformRouter.delete('/profile/me', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  try {
    await query('DELETE FROM users WHERE id = $1', [request.user.sub]);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

platformRouter.post('/skills', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  try {
    const { name, level = 'intermediate' } = request.body ?? {};
    if (!name) return response.status(400).json({ message: 'Skill name is required.' });
    await ensureSkills(request.user.sub, [name], level);
    response.status(201).json({ message: 'Skill added.' });
  } catch (error) {
    next(error);
  }
});

platformRouter.delete('/skills/:name', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  try {
    await query(
      `DELETE FROM user_skills us
       USING skills s
       WHERE us.skill_id = s.id AND us.user_id = $1 AND LOWER(s.name::text) = LOWER($2)`,
      [request.user.sub, request.params.name],
    );
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/projects', async (request, response, next) => {
  try {
    const { skill = '', tech = '', category = '', status = '', q = '' } = request.query;
    const result = await query(
      `SELECT ${projectSelect()}
       FROM projects p
       JOIN users owner ON owner.id = p.owner_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
       LEFT JOIN users member_user ON member_user.id = pm.user_id
       WHERE p.is_public = TRUE
         AND ($1 = '' OR $1 = ANY(p.required_skills))
         AND ($2 = '' OR $2 = ANY(p.tech_stack))
         AND ($3 = '' OR p.category ILIKE $3)
         AND ($4 = '' OR p.status::text = $4)
         AND ($5 = '' OR p.title ILIKE '%' || $5 || '%' OR p.description ILIKE '%' || $5 || '%')
       GROUP BY p.id, owner.id
       ORDER BY p.created_at DESC`,
      [skill, tech, category, status, q],
    );

    response.json({ projects: result.rows });
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/projects/recommended', requireAuth, async (request, response, next) => {
  try {
    const result = await query(
      `WITH my_skills AS (
         SELECT LOWER(s.name::text) AS name
         FROM user_skills us JOIN skills s ON s.id = us.skill_id
         WHERE us.user_id = $1
       )
       SELECT ${projectSelect()},
              (SELECT COUNT(*) FROM unnest(p.required_skills) req JOIN my_skills ms ON LOWER(req) = ms.name) AS match_count
       FROM projects p
       JOIN users owner ON owner.id = p.owner_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
       LEFT JOIN users member_user ON member_user.id = pm.user_id
       WHERE p.is_public = TRUE AND p.owner_id <> $1
       GROUP BY p.id, owner.id
       HAVING (SELECT COUNT(*) FROM unnest(p.required_skills) req JOIN my_skills ms ON LOWER(req) = ms.name) > 0
       ORDER BY match_count DESC, p.created_at DESC`,
      [request.user.sub],
    );

    response.json({ projects: result.rows });
  } catch (error) {
    next(error);
  }
});

platformRouter.post('/projects', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  const { title, description, category, repositoryUrl, liveUrl, techStack, requiredSkills, teamSize, status } =
    request.body ?? {};

  if (!title || !description) {
    return response.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const result = await query(
      `INSERT INTO projects (owner_id, title, description, category, repository_url, live_url, tech_stack,
                             required_skills, team_size, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::project_status, 'recruiting'))
       RETURNING *`,
      [
        request.user.sub,
        title,
        description,
        category || 'Web App',
        repositoryUrl || null,
        liveUrl || null,
        normalizeList(techStack),
        normalizeList(requiredSkills),
        Number(teamSize) || 3,
        status || 'recruiting',
      ],
    );

    await query(
      `INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, 'owner') ON CONFLICT DO NOTHING`,
      [result.rows[0].id, request.user.sub],
    );

    const matchingUsers = await query(
      `SELECT DISTINCT u.id
       FROM users u
       JOIN user_skills us ON us.user_id = u.id
       JOIN skills s ON s.id = us.skill_id
       WHERE u.id <> $1 AND LOWER(s.name::text) = ANY($2)`,
      [request.user.sub, normalizeList(requiredSkills).map((skill) => skill.toLowerCase())],
    );

    await Promise.all(
      matchingUsers.rows.map((row) =>
        notify(row.id, 'project_match', 'A matching project is available', `${title} needs skills you have.`, '/projects'),
      ),
    );

    response.status(201).json({ project: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

platformRouter.put('/projects/:id', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  const { title, description, category, repositoryUrl, liveUrl, techStack, requiredSkills, teamSize, status } =
    request.body ?? {};

  try {
    const owner = await query('SELECT owner_id FROM projects WHERE id = $1', [request.params.id]);
    if (!owner.rows[0]) return response.status(404).json({ message: 'Project not found.' });
    if (request.user.role !== 'admin' && String(owner.rows[0].owner_id) !== String(request.user.sub)) {
      return response.status(403).json({ message: 'Only the project owner can edit this project.' });
    }

    const result = await query(
      `UPDATE projects
       SET title = $1, description = $2, category = $3, repository_url = $4, live_url = $5,
           tech_stack = $6, required_skills = $7, team_size = $8, status = $9::project_status,
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        title,
        description,
        category,
        repositoryUrl || null,
        liveUrl || null,
        normalizeList(techStack),
        normalizeList(requiredSkills),
        Number(teamSize) || 3,
        status || 'recruiting',
        request.params.id,
      ],
    );
    response.json({ project: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

platformRouter.delete('/projects/:id', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  try {
    const owner = await query('SELECT owner_id FROM projects WHERE id = $1', [request.params.id]);
    if (!owner.rows[0]) return response.status(404).json({ message: 'Project not found.' });
    if (request.user.role !== 'admin' && String(owner.rows[0].owner_id) !== String(request.user.sub)) {
      return response.status(403).json({ message: 'Only the project owner can delete this project.' });
    }
    await query('DELETE FROM projects WHERE id = $1', [request.params.id]);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

platformRouter.post('/projects/:id/join', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  try {
    const project = await query('SELECT id, owner_id, title FROM projects WHERE id = $1', [request.params.id]);
    if (!project.rows[0]) return response.status(404).json({ message: 'Project not found.' });
    if (String(project.rows[0].owner_id) === String(request.user.sub)) {
      return response.status(400).json({ message: 'Owners are already members of their projects.' });
    }

    const result = await query(
      `INSERT INTO join_requests (user_id, project_id, message)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, project_id) DO UPDATE SET message = EXCLUDED.message, status = 'pending', updated_at = NOW()
       RETURNING *`,
      [request.user.sub, request.params.id, request.body?.message || null],
    );

    await notify(project.rows[0].owner_id, 'join_request', 'New project join request', `${request.user.name} asked to join ${project.rows[0].title}.`, '/requests');
    response.status(201).json({ request: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/requests', requireAuth, async (request, response, next) => {
  try {
    const incoming = await query(
      `SELECT jr.*, p.title AS project_title, u.name AS applicant_name, u.title AS applicant_title,
              COALESCE(json_agg(json_build_object('name', s.name, 'level', us.level))
                FILTER (WHERE s.id IS NOT NULL), '[]') AS applicant_skills
       FROM join_requests jr
       JOIN projects p ON p.id = jr.project_id
       JOIN users u ON u.id = jr.user_id
       LEFT JOIN user_skills us ON us.user_id = u.id
       LEFT JOIN skills s ON s.id = us.skill_id
       WHERE p.owner_id = $1
       GROUP BY jr.id, p.title, u.id
       ORDER BY jr.created_at DESC`,
      [request.user.sub],
    );
    const outgoing = await query(
      `SELECT jr.*, p.title AS project_title FROM join_requests jr JOIN projects p ON p.id = jr.project_id
       WHERE jr.user_id = $1 ORDER BY jr.created_at DESC`,
      [request.user.sub],
    );
    response.json({ incoming: incoming.rows, outgoing: outgoing.rows });
  } catch (error) {
    next(error);
  }
});

platformRouter.patch('/requests/:id', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  const { status } = request.body ?? {};
  if (!['approved', 'rejected'].includes(status)) {
    return response.status(400).json({ message: 'Status must be approved or rejected.' });
  }

  try {
    const requestResult = await query(
      `SELECT jr.*, p.owner_id, p.title FROM join_requests jr JOIN projects p ON p.id = jr.project_id WHERE jr.id = $1`,
      [request.params.id],
    );
    const joinRequest = requestResult.rows[0];
    if (!joinRequest) return response.status(404).json({ message: 'Join request not found.' });
    if (request.user.role !== 'admin' && String(joinRequest.owner_id) !== String(request.user.sub)) {
      return response.status(403).json({ message: 'Only the owner can review this request.' });
    }

    const updated = await query(
      `UPDATE join_requests SET status = $1::join_request_status, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, request.params.id],
    );

    if (status === 'approved') {
      await query(
        `INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT DO NOTHING`,
        [joinRequest.project_id, joinRequest.user_id],
      );
    }

    await notify(
      joinRequest.user_id,
      'request_reviewed',
      `Join request ${status}`,
      `Your request for ${joinRequest.title} was ${status}.`,
      '/requests',
    );

    response.json({ request: updated.rows[0] });
  } catch (error) {
    next(error);
  }
});

platformRouter.post('/projects/:id/collaborators', requireAuth, requireRole(...editableRoles), async (request, response, next) => {
  const { recipientId, message, requestedSkills } = request.body ?? {};
  if (!recipientId) return response.status(400).json({ message: 'Recipient is required.' });

  try {
    const project = await query('SELECT owner_id, title FROM projects WHERE id = $1', [request.params.id]);
    if (!project.rows[0]) return response.status(404).json({ message: 'Project not found.' });
    if (request.user.role !== 'admin' && String(project.rows[0].owner_id) !== String(request.user.sub)) {
      return response.status(403).json({ message: 'Only the owner can invite collaborators.' });
    }

    const result = await query(
      `INSERT INTO collaboration_requests (project_id, sender_id, recipient_id, message, requested_skills)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (project_id, recipient_id) DO UPDATE
       SET message = EXCLUDED.message, requested_skills = EXCLUDED.requested_skills, status = 'pending', updated_at = NOW()
       RETURNING *`,
      [request.params.id, request.user.sub, recipientId, message || null, normalizeList(requestedSkills)],
    );

    await notify(recipientId, 'collaboration_invite', 'Collaboration request', `${request.user.name} invited you to ${project.rows[0].title}.`, '/requests');
    response.status(201).json({ request: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/notifications', requireAuth, async (request, response, next) => {
  try {
    const result = await query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [
      request.user.sub,
    ]);
    response.json({ notifications: result.rows });
  } catch (error) {
    next(error);
  }
});

platformRouter.patch('/notifications/:id/read', requireAuth, async (request, response, next) => {
  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [
      request.params.id,
      request.user.sub,
    ]);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

platformRouter.get('/admin/overview', requireAuth, requireRole('admin'), async (request, response, next) => {
  try {
    const users = await query('SELECT id, name, email, role, profile_complete, created_at FROM users ORDER BY created_at DESC');
    const projects = await query('SELECT id, title, status, category, created_at FROM projects ORDER BY created_at DESC');
    const requests = await query('SELECT id, status, created_at FROM join_requests ORDER BY created_at DESC');
    response.json({ users: users.rows, projects: projects.rows, requests: requests.rows });
  } catch (error) {
    next(error);
  }
});
