import { NodeVM } from 'vm2';

export interface Rule {
  match?: RegExp;
  replace?: (args?: any) => string;
  use?: string;
}

export function parseRules(ruleString: string, sandbox: object): Rule[] {
  const vm = new NodeVM({
    sandbox,
    console: 'off',
    eval: false,
    require: true,
    timeout: 2000,
    wrapper: 'none',
  });
  let rules = vm.run('return ' + ruleString);

  if (!Array.isArray(rules)) {
    rules = [rules];
  }
  return rules;
}
