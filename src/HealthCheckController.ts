import { controller, httpGet } from 'inversify-express-utils';

@controller('/health')
class HealthCheckController {
  @httpGet('/')
  public async index() {
    return 'ok';
  }
}