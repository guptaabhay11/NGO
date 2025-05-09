import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import errorHandler from "./src/common/middleware/error-handler.middleware";
import { initDB } from "./src/common/services/database.services";
import { initPassport } from "./src/common/services/passport-jwt.services";
import swaggerDocument from "./src/swagger/swagger.json";
import routes from "./src/routes";
import { type IUser } from "./src/user/user.dto";
import {
  stripeRouter,
  stripeWebhookRouter,
} from "./src/stripe/stripe.routes";



declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(cors())
app.use(helmet())
app.use("/api/stripe", stripeWebhookRouter);



app.use(bodyParser.json());



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/stripe", stripeRouter);

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  // passport init
  initPassport();

  // set base path to /api

  app.use("/api", routes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();