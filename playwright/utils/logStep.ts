/* eslint-disable  @typescript-eslint/no-explicit-any */
import { test } from '@playwright/test';

export function logStep<This, Args extends any[], Return>(message?: string) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function replacementMethod(this: any, ...args: Args) {
      const name: string = message ?? `${this.constructor.name}.${context.name as string}`;

      return test.step(name, async () => await target.call(this, ...args), { box: false });
    }

    return replacementMethod;
  };
}
