const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./db')

const app = express();
const port = process.env.PORT || 5000;
const secrectKey = '213120ndanadadoh-0421kjdbkabdhuwoh';

app.use(bodyParser.json());

//Auth API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    //Validate username n password
    if (username === 'ngadimin' && password === 'qweasdzxc') {
        const token = jwt.sign({username}, secrectKey);
        res.json({token});
    } else {
        res.status(401).json({
            message: "Login failed. Please re-check your username and password."
        })
    }
});

// Middleware for checking the token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({
        message: 'Token is not available.'
    });

    jwt.verify(token, secrectKey, (err, user) => {
        if (err) return res.status(403).json({
            message: 'Token is not valid.'
        });
        req.user = user;
        next();
    });
}

//Guesbook Form API
app.post('/guests', (req, res) => {
    const { name, address, phone, note } = req.body;
    db.run(
        'INSERT INTO guests (name, address, phone, note) VALUES (?, ?, ?, ?)', 
        [name, address, phone, note], (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Failed to added a guest.'
                });
            }
            res.json({
                message: 'Success. Guest has been added.'
            });
        });
});

// Notes API - Get all notes just for name and note field
app.get('/notes', (req, res) => {
    db.all('SELECT name, note FROM guests', (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to get a note.'
            });
        }
        res.json(rows);
    });
});

// ==================================================
// ADMIN API SECTION - CRUD OPERATION WITH AUTH TOKEN
// ==================================================
app.get('/admin/notes', authenticateToken, (req, res) => {
    db.all('SELECT * FROM guests', (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to get all notes.'
            });
        }
        res.json(rows);
    });
});

app.get('/admin/notes/:id', authenticateToken, (req, res) => {
    const guestId = req.params.id;
    db.get('SELECT * FROM guests WHERE id = ?', [guestId], (err, row) => {
      if (err) {
        return res.status(500).json({ 
            message: 'Failed to get a guestbook.' 
        });
      }
      if (!row) {
        return res.status(404).json({ 
            message: 'Guestbook not found.' 
        });
      }
      res.json(row);
    });
});

app.post('/admin/notes', authenticateToken, (req, res) => {
    const { name, address, phone, note } = req.body;
    db.run('INSERT INTO guests (name, address, phone, note) VALUES (?, ?, ?, ?)', [name, address, phone, note], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal menambahkan tamu' });
        }
        res.json({ 
            message: 'Success. Guest has been added.' 
        });
    });
});

app.put('/admin/notes/:id', authenticateToken, (req, res) => {
    const guestId = req.params.id;
    const { name, address, phone, note } = req.body;
    db.run('UPDATE guests SET name = ?, address = ?, phone = ?, note = ? WHERE id = ?', [name, address, phone, note, guestId], (err) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Failed to update guestbook data.' }
            );
        }
        res.json({ 
            message: 'Guestbook has been updated.' 
        });
    });
});

app.delete('/admin/notes/:id', authenticateToken, (req, res) => {
    const guestId = req.params.id;
    db.run('DELETE FROM guests WHERE id = ?', [guestId], (err) => {
        if (err) {
            return res.status(500).json({ 
                message: 'Failed to delete guestbook data.' 
            });
        }
        res.json({ 
            message: 'Guestbook has been deleted.' 
        });
    });
});

//Run application
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});