import app from './app';
import dotenv from 'dotenv';
import db from './database/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
    try {
        // Initialize SQLite database
        await db.init();
        console.log('✓ Database initialized');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                await db.close();
                console.log('HTTP server closed');
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                await db.close();
                console.log('HTTP server closed');
                process.exit(0);
            });
        });

        return server;
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default startServer;
