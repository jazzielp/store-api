import express, {
  type Request,
  type Response,
  type Application,
} from "express";

import { routerApi } from "./routes";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello via Bun and Express!");
});

routerApi(app);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

console.log("Hello via Bun!");
