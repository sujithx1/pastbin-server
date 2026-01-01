import express from "express";
import cors from "cors";
import path from "path";
import healthz from "./router/healthz";
import pastes from "./router/pastes";

const app = express();

app.use(cors());


app.use(express.json());

app.use("/api/healthz", healthz);
app.use("/api/pastes", pastes);

/* Serve React build */
// const clientPath = path.join(__dirname, "../../frontend/dist");
// app.use(express.static(clientPath));

// app.get("/p/:id", (req, res) => {
//   res.sendFile(path.join(clientPath, "index.html"));
// });

// app.get("*", (_, res) => {
//   res.sendFile(path.join(clientPath, "index.html"));
// });



export default app;