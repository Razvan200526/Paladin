import { color } from 'console-log-colors';
import PrettyError from 'pretty-error';

export const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('bun', 'zod');

export function printEnvErrors(errors: any[]) {
  let message = `${color.redBright('✘ Missing Environment Variables')}\n\n`;

  errors.forEach((err) => {
    const variable = err.path[0];
    const cleaned = err.message.replace(/\s+/g, ' ');
    message += `${color.yellow('•')} ${color.white(variable)} ${color.gray('→')} ${color.red(cleaned)}\n`;

    const e = new Error(message);

    console.error(pe.render(e));
  });
}
