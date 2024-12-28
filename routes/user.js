const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.get('/login',async(req,res)=>{
    try {
        const result = await pool.query (`SELECT * FROM users;`);
        res.json(result.rows);
    } catch (error) {
    res.status(500).json({ message: "Data inserted failed" });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE "username" = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        if (user.password !== password) { 
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router