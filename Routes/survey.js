import express from 'express';
const router = express.Router();

let feedbacks = [];

router.post('/api/submit-feedback', (req, res) => {
  feedbacks.push({ ...req.body, date: new Date() });
  res.json({ message: 'Feedback stored' });
});

router.get('/api/all-feedback', (req, res) => {
  res.json(feedbacks);
});

export default router;
