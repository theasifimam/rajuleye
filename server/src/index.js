import './load-env.js';
import app from './app.js';
import connectDB from './config/db.js';


const PORT = process.env.API_PORT || 5000;
const MODE = process.env.MODE || "development";



// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${MODE || 'development'} mode on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});

// Trigger restart
