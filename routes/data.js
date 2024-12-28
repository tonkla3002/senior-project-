const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM data;`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Data inserted failed" });
  }
});

router.post("/", async (req, res) => {
  const { barcode_p, station, username, voltage_p, current_p, frequency_p, power_p, temp_1, temp_2, temp_3, temp_1r, temp_2r, temp_3r, temp_r, status, detail, name_p } = req.body;
  console.log(barcode_p, station, username, voltage_p, current_p, frequency_p, power_p, temp_1, temp_2, temp_3, temp_1r, temp_2r, temp_3r, temp_r, status, detail, name_p);

  try {
    // Correct SQL query syntax
    const query = `
      INSERT INTO data(
        barcode_p, station, username, voltage_p, current_p, frequency_p, power_p, temp_1, temp_2, temp_3, temp_1r, temp_2r, temp_3r, temp_r, status, detail, name_p
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
    `;

    // Await the database query
    await pool.query(query, [
      barcode_p, station, username, voltage_p, current_p, frequency_p, power_p, temp_1, temp_2, temp_3, temp_1r, temp_2r, temp_3r, temp_r, status, detail, name_p
    ]);

    res.json({
      message: "Data inserted successfully",
      data: { barcode_p, station, username, voltage_p, current_p, frequency_p, power_p, temp_1, temp_2, temp_3, temp_1r, temp_2r, temp_3r, temp_r, status, detail, name_p }
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Data insertion failed", error: error.message });
  }
});

module.exports = router;
