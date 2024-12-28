// const express = require("express");
// const router = express.Router();
// const pool = require("../pool");

// router.get("/", async (req, res) => {
//     const { search, category, orderby } = req.query;

//     try {
//         // Validate category (อนุญาตเฉพาะชื่อคอลัมน์ที่กำหนดไว้เท่านั้น)
//         const validCategories = ["name", "age", "price"]; // เพิ่มคอลัมน์ที่อนุญาต
//         if (category && !validCategories.includes(category)) {
//             return res.status(400).json({ message: "Invalid category" });
//         }

//         // Validate orderby (อนุญาตเฉพาะ ASC หรือ DESC)
//         const order = orderby && orderby.toUpperCase() === "ASC" ? "ASC" : "DESC";

//         let query = `SELECT * FROM data`;
//         const values = [];

//         // กรณีที่เลือก category และ search
//         if (category && search) {
//             query += ` WHERE ${category} = $1`;
//             values.push(search);
//         }

//         query += ` ORDER BY create_at ${order};`;

//         console.log("SQL Query:", query);
//         console.log("Values:", values);

//         // Execute the query
//         const result = await pool.query(query, values);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error("Error executing query:", error);
//         res.status(500).json({ message: "Error retrieving data" });
//     }
// });

// router.get('test',(req,res)=<{
//     query += ` ORDER BY created_at ${order};`;
// })
// module.exports = router;
