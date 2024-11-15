const express = require('express'); // Import Express
const app = express(); // Create an Express app

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
