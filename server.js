import 'dotenv/config';
import app from './app.js';
import connectDB from './app/config/db.js';

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});