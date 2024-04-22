"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const routes = require('./routes');
// Middleware
app.use(express_1.default.json());
// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/your_database';
mongoose_1.default.connect(mongoURI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/api/', routes);
