// /frontend/script.js
// This script handles all the logic for button clicks and display updates.

// Use a DOMContentLoaded listener to ensure the script runs only after the HTML is fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    const display = document.querySelector('.calculator-display');
    const buttons = document.querySelector('.calculator-buttons');

    let firstValue = null;
    let operator = null;
    let waitingForSecondValue = false;
    let currentInput = '';

    // Function to update the display
    function updateDisplay(value) {
        display.value = value;
    }

    // Event listener for all button clicks on the calculator-buttons div
    buttons.addEventListener('click', (event) => {
        const { target } = event;

        // Ignore clicks that are not on a button element
        if (!target.matches('button')) {
            return;
        }

        const value = target.dataset.value;

        // Handle the "All Clear" button
        if (value === 'AC') {
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
            currentInput = '';
            updateDisplay('');
            return;
        }

        // Handle operator buttons (+, -, *, /)
        if (target.classList.contains('operator')) {
            // If an operator is clicked, store the first value and the operator
            if (firstValue === null) {
                firstValue = parseFloat(currentInput);
            }
            operator = value;
            waitingForSecondValue = true;
            currentInput = ''; // Clear the input for the next number
            return;
        }

        // Handle the equals button
        if (value === '=') {
            if (firstValue !== null && operator !== null && currentInput !== '') {
                calculateAndDisplay();
            }
            return;
        }

        // Handle number and decimal point buttons
        if (value === '.' && currentInput.includes('.')) {
            return; // Prevent multiple decimal points
        }
        
        currentInput += value;
        updateDisplay(currentInput);
    });

    /**
     * Sends the current calculation to the backend server and updates the display with the result.
     */
    async function calculateAndDisplay() {
        if (firstValue === null || operator === null || currentInput === '') {
            return;
        }

        const num1 = firstValue;
        const num2 = parseFloat(currentInput);

        const payload = { num1, num2, operator };

        try {
            const response = await fetch('http://localhost:3000/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            // Update the display with the result from the backend
            updateDisplay(data.result);

            // Reset state for the next calculation
            firstValue = data.result;
            operator = null;
            waitingForSecondValue = false;
            currentInput = data.result.toString();

        } catch (error) {
            console.error('Error during calculation:', error);
            updateDisplay('Error');
            // Reset all state on error
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
            currentInput = '';
        }
    }
});
