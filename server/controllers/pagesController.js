const database = require('../config/database');

// Formate une ligne page comme l'ancien backend (camelCase, title/content parsés)
function formatPage(row) {
  if (!row) return null;
  const parseJson = (v) => {
    if (v == null) return v;
    if (typeof v === 'object') return v;
    try { return JSON.parse(v); } catch { return v; }
  };
  return {
    id: row.id,
    title: parseJson(row.title),
    slug: row.slug,
    content: parseJson(row.content),
    isPublished: row.is_published === 1 || row.is_published === true,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const PagesController = {
  // GET /api/pages
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM pages ORDER BY created_at DESC');
      res.json({ success: true, data: rows.map(formatPage) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // GET /api/pages/:slug
  async getBySlug(req, res) {
    try {
      const rows = await database.query('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'Page non trouvée' });
      }
      res.json({ success: true, data: formatPage(rows[0]) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/pages (accepte title/content en string ou objet, isPublished ou is_published)
  async create(req, res) {
    try {
      const { title, slug, content, isPublished, is_published } = req.body;
      const titleStr = typeof title === 'string' ? title : JSON.stringify(title || {});
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content || {});
      const published = is_published ?? isPublished ?? 1;
      await database.run(
        'INSERT INTO pages (title, slug, content, is_published) VALUES (?, ?, ?, ?)',
        [titleStr, slug, contentStr, published ? 1 : 0]
      );
      const inserted = await database.query('SELECT * FROM pages WHERE slug = ? ORDER BY id DESC LIMIT 1', [slug]);
      res.status(201).json({ success: true, data: formatPage(inserted[0]) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // PUT /api/pages/:id
  async update(req, res) {
    try {
      const { title, slug, content, isPublished, is_published } = req.body;
      const titleStr = title != null ? (typeof title === 'string' ? title : JSON.stringify(title)) : null;
      const contentStr = content != null ? (typeof content === 'string' ? content : JSON.stringify(content)) : null;
      const published = is_published ?? isPublished;
      const updates = [];
      const params = [];
      if (titleStr !== null) { updates.push('title = ?'); params.push(titleStr); }
      if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
      if (contentStr !== null) { updates.push('content = ?'); params.push(contentStr); }
      if (published !== undefined) { updates.push('is_published = ?'); params.push(published ? 1 : 0); }
      if (updates.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
      params.push(req.params.id);
      await database.run(`UPDATE pages SET ${updates.join(', ')} WHERE id = ?`, params);
      const rows = await database.query('SELECT * FROM pages WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: formatPage(rows[0]) });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // DELETE /api/pages/:id
  async delete(req, res) {
    try {
      await database.run('DELETE FROM pages WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Page supprimée' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = PagesController;
