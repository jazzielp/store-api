import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import morgan from "morgan";

import { PORT } from "@/config/config";
import { routerApi } from "./routes";

export const app: Application = express();
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello via Bun and Express!");
});

routerApi(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

console.log("Hello via Bun!");
