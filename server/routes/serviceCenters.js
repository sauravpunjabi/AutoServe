const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Create Service Center (Manager only)
router.post("/", authorize, async (req, res) => {
    try {
        // Only managers can create service centers
        if (req.user.role !== "manager") {
            return res.status(403).json("Access Denied");
        }

        const { name, location, contact } = req.body;
        const newServiceCenter = await pool.query(
            "INSERT INTO service_centers (name, location, contact, manager_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, location, contact, req.user.id]
        );

        res.json(newServiceCenter.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// List All Service Centers
router.get("/", async (req, res) => {
    try {
        const serviceCenters = await pool.query("SELECT * FROM service_centers");
        res.json(serviceCenters.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Join Request (Mechanic only)
router.post("/:id/join", authorize, async (req, res) => {
    try {
        if (req.user.role !== "mechanic") {
            return res.status(403).json("Access Denied: Mechanics Only");
        }

        const { id } = req.params;

        // Check if request already exists
        const existingRequest = await pool.query(
            "SELECT * FROM mechanic_requests WHERE service_center_id = $1 AND mechanic_id = $2",
            [id, req.user.id]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(400).json("Request already sent");
        }

        const newRequest = await pool.query(
            "INSERT INTO mechanic_requests (service_center_id, mechanic_id, status) VALUES ($1, $2, 'pending') RETURNING *",
            [id, req.user.id]
        );

        res.json(newRequest.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
