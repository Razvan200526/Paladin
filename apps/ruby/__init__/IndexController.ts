/**
 * Example Index Controller
 * Serves the React SPA with server-side rendered shell
 */
import {
  CONTAINER_KEYS,
  controller,
  get,
  inject,
  render,
} from '@razvan11/paladin';
import type { Context } from 'hono';
import { IndexView } from './IndexView';

@controller()
export class IndexController {
  constructor(
    @inject(CONTAINER_KEYS.APP_URL)
    private readonly apiUrl: string,
  ) { }

  @get('/*')
  index(c: Context) {
    return render(c, IndexView, {
      apiUrl: this.apiUrl || 'http://localhost:3000',
    });
  }
}
