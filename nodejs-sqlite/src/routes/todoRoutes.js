import express from 'express';
import db from '../db.js';

const router = express.Router();

/**
 * GET all Todos for Logged-In User
 */
router.get('/', (req, res) => {
  const query = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const result = query.all(req.userId);
  res.json(result);
});


/**
 * CREATE a new Todo
 */
router.post('/', (req, res) => {
  const { task } = req.body;
  const query = db.prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)");
  
  const result = query.run(req.userId, task);

  res.json({id: query.lastInsertRowId, task, completed: 0 });
});


/**
 * UPDATE a existing Todo
 */
router.put('/:id', (req, res) => {
  const { completed } = req.body;
  const { id } = req.params

  const query = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
  query.run(completed, id);

  res.json({ message: "Todo completed" });

});


/**
 * DELETE a existing Todo
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const query = db.prepare("DELETE FROM todos WHERE id = ? AND user_id = ?");

  query.run(id, userId);
  res.send({ message: "Todo deleted" });
});


export default router;