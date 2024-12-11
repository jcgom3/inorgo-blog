import { createServer } from "@vercel/node";
import app from "../server/index.js"; // Adjust path based on the location of your server code

export default createServer(app);
