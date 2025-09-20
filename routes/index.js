import express from "express";
const router = express.Router();


//renders home page with latitude longitude form 

router.get("/", (req, res) => {
res.render("pages/index", { title: "Crazy For Earth" });
});

export default router;

