import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import morgan from "morgan";

import { routerApi } from "./routes";

export const app: Application = express();
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello via Bun and Express!");
});

routerApi(app);

app.listen(3000, () => {
  console.log(`Server is running on ${process.env.BASE_URL}`);
});

console.log("Hello via Bun!");
