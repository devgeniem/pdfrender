import express from 'express';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { ErrorHandler } from './ErrorHandler';
import { Container } from 'inversify';

import './PuppeteerController';
import './HealthCheckController';

const app = express();

const container = new Container();

app.use( (req, res, next) => {
  res.header('Content-Type', 'application/pdf')
  res.header('Content-Disposition', 'attachment; filename="report.pdf"')
  next();
})

app.use(express.json());

const inversifyServer = new InversifyExpressServer(container, null, null, app);
app.use(ErrorHandler);
inversifyServer
  .setErrorConfig((it) => it.use(ErrorHandler))
  .build()
  .listen(process.env.PORT || 30003);