const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM detail_p;`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Data inserted failed" });
  }
});

router.get("/:name", async (req, res) => {
  const { name } = req.params; // Extract 'name' directly from 'req.params'
  try {
    const result = await pool.query(`SELECT * FROM detail_p WHERE name_p = $1;`, [name]); // Pass the correct value
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Data retrieval failed" }); // Corrected error message
  }
});


router.delete("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    await pool.query("BEGIN"); // Start transaction

    // Optionally delete dependent rows in foreign key tables
    await pool.query(
      `DELETE FROM data WHERE name_p = $1;`,
      [name]
    );

    // Delete the primary row
    const result = await pool.query(
      `DELETE FROM detail_p WHERE name_p = $1;`,
      [name]
    );

    await pool.query("COMMIT"); // Commit transaction

    if (result.rowCount > 0) {
      res.send("Delete complete");
    } else {
      res.status(404).json({ message: "No record found to delete" });
    }
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback on error
    console.error(error); // Log the error for debugging

    // Handle foreign key constraint violation
    if (error.code === "23503") { // Foreign key violation code
      res.status(400).json({
        message: "Cannot delete: record is referenced in another table.",
      });
    } else {
      res.status(500).json({ message: "Failed to delete data" });
    }
  }
});


router.post("/", async (req, res) => {
  const { name_p, temp_limit, current_limit, time_limit } = req.body;
  console.log(name_p, temp_limit, current_limit, time_limit);

  try {
    // Correct SQL query syntax
    const query = `
                  INSERT INTO public.detail_p(
                  name_p, temp_limit, current_limit, time_limit)
                  VALUES ($1, $2, $3, $4);
    `;

    // Await the database query
    await pool.query(query, [
      name_p, temp_limit, current_limit, time_limit
    ]);

    res.json({
      message: "Data inserted successfully",
      data: { name_p, temp_limit, current_limit, time_limit }
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Data insertion failed", error: error.message });
  }
});


router.put("/", async (req, res) => {
  const { nameOld, nameNew, temp_limit, current_limit, time_limit } = req.body;

  try {
    await pool.query("BEGIN");

    // ตรวจสอบและกำหนดค่า NULL หากเป็นค่าว่าง
    const tempLimit = temp_limit === "" ? null : temp_limit;
    const currentLimit = current_limit === "" ? null : current_limit;
    const timeLimit = time_limit === "" ? null : time_limit;

    // อัปเดตข้อมูล
    const result = await pool.query(
      `UPDATE detail_p
       SET name_p = $1, 
           temp_limit = COALESCE($2, temp_limit), 
           current_limit = COALESCE($3, current_limit), 
           time_limit = COALESCE($4, time_limit)
       WHERE name_p = $5;`,
      [nameNew, tempLimit, currentLimit, timeLimit, nameOld]
    );

    await pool.query("COMMIT");

    if (result.rowCount > 0) {
      res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
    } else {
      res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
});


module.exports = router;