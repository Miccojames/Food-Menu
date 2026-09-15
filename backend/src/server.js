import dotenv from 'dotenv';
dotenv.config();

import prisma from './lib/prisma.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Verify DB connection then start server
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Neon PostgreSQL connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other process or change PORT.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

main();
