import { NodeVM } from 'vm2';
import { fail } from 'epicfail';

export interface Rule {
  match?: RegExp;
  replace?: ((args?: any) => string) | string;
  use?: string;
}

export function parseRules(ruleString: string, sandbox: object): Rule[] {
  try {
    const vm = new NodeVM({
      sandbox,
      console: 'off',
      eval: false,
      require: true,
      timeout: 2000,
      wrapper: 'none',
    });
    let rules = vm.run('return ' + ruleString);

    // normalize to array
    if (!Array.isArray(rules)) {
      rules = [rules];
    }

    return rules;
  } catch (err) {
    if (err instanceof ReferenceError) {
      fail(
        err.message + '\n' + `Did you forget to add "--define.<key> <value>" ?`,
        {
          soft: true,
        },
      );
    }
    throw err;
  }
}
