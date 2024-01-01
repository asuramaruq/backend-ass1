const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/bmicalculator', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/bmicalculator', (req, res) => {
    const height = parseFloat(req.body.height);
    const weight = parseFloat(req.body.weight);
    const units = req.body.units;
    const age = parseInt(req.body.age);
    const gender = req.body.gender;

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0 || isNaN(age) || age <= 0) {
        res.status(400).send('Please enter valid values for height, weight, and age.');
        return;
    }

    let bmi;
    if (units === 'metric') {
        bmi = weight / ((height / 100) ** 2);
    } else if (units === 'imperial') {
        bmi = (weight / (height ** 2)) * 703;
    } else {
        res.status(400).send('Invalid units. Please select either "metric" or "imperial".');
        return;
    }

    if (gender === 'female') {
        bmi -= 0.5;
    }

    let category = '';

    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal weight';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        category = 'Overweight';
    } else if (bmi >= 30.0 && bmi <= 34.9) {
        category = 'Obese';
    } else {
        category = 'Extremely obese';
    }

    let message = `Your BMI value: ${bmi.toFixed(2)}.\nCategory: ${category}.\nAge: ${age}.\nGender: ${gender}.`;

    if (age < 18) {
        message += `\nNote: The BMI categories may not be accurate for individuals under 18 years old.`;
    }

    res.send(message);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
