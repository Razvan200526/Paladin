/**
 * Example Index Controller
 * Serves the React SPA with server-side rendered shell
 */
import { controller, get, inject } from '@razvan11/paladin';
import type { Context } from 'hono';
import { IndexView } from './IndexView';
import { render } from './render';

@controller()
export class IndexController {
  constructor(
    @inject('APP_URL')
    private readonly apiUrl: string,
  ) {}

  @get('/*')
  index(c: Context) {
    return render(c, IndexView, {
      apiUrl: this.apiUrl || 'http://localhost:3000',
    });
  }
}
