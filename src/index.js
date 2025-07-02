import app from './app.js'
import { connectDB } from './db.js'
import cors from "cors";

connectDB();
app.listen(3000);
console.log("Servidor en puerto 3000");