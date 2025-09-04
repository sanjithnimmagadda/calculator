// server.js
// A simple Node.js server using Express to handle calculator logic and serve front-end files.

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Serve static files from the 'frontend' directory
// This allows you to serve index.html and calculator.html from the server.
app.use(express.static(path.join(__dirname, 'frontend')));

/**
 * API endpoint to perform a calculation.
 * It expects a JSON body with num1, num2, and an operator.
 */
app.post('/calculate', (req, res) => {
    // Destructure the request body
    const { num1, num2, operator } = req.body;

    // Check if the input is valid numbers
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ result: 'Error: Invalid number input' });
    }
    
    let result;

    // Use a switch statement to perform the correct operation
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            // Handle division by zero
            if (num2 === 0) {
                return res.status(400).json({ result: 'Error: Division by zero' });
            }
            result = num1 / num2;
            break;
        default:
            // Handle invalid operator
            return res.status(400).json({ result: 'Error: Invalid operator' });
    }

    // Send the result back as a JSON object
    res.json({ result: result });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
