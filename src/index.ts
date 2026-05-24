import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions";
import registerRouter from "./routes/api/register";
import loginRouter from "./routes/api/login";
import refreshRouter from "./routes/api/refresh";
import logoutRouter from "./routes/api/logout";
import verifyJWT from "./middleware/verifyJwt";

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

app.use(verifyJWT);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Try:`);
  console.log(`http://localhost:${port}/register`);
  console.log(`http://localhost:${port}/login`);
  console.log(`http://localhost:${port}/refresh`);
  console.log(`http://localhost:${port}/logout`);
});
