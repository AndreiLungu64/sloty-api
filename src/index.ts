import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions";

import registerRouter from "./routes/api/register";
import loginRouter from "./routes/api/login";
import refreshRouter from "./routes/api/refresh";
import logoutRouter from "./routes/api/logout";

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
