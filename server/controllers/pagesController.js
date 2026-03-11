const database = require('../config/database');

const PagesController = {
  // GET /api/pages
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM pages ORDER BY created_at DESC');
      res.json({ success: true, data: rows });
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
      res.json({ success: true, data: rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/pages
  async create(req, res) {
    try {
      const { title, slug, content, is_published } = req.body;
      const result = await database.run(
        'INSERT INTO pages (title, slug, content, is_published) VALUES (?, ?, ?, ?)',
        [title, slug, content, is_published ?? 1]
      );
      res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // PUT /api/pages/:id
  async update(req, res) {
    try {
      const { title, slug, content, is_published } = req.body;
      await database.run(
        'UPDATE pages SET title = ?, slug = ?, content = ?, is_published = ? WHERE id = ?',
        [title, slug, content, is_published ?? 1, req.params.id]
      );
      res.json({ success: true, data: { id: req.params.id, ...req.body } });
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
