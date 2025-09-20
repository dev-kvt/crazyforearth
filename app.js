import  express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";
import soilRoutes from "./routes/soil.js";
//.env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//ejs setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//middlewares 
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//register routes
app.use("/", indexRoutes);   // <-- Home route
app.use("/soil", soilRoutes); // <-- Soil API route


//error handlers
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", { 
        message: "Internal Server Error", 
        title: "Crazy For Earth"
    });
});
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
