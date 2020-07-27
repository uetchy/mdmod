import { NodeVM } from 'vm2';

export interface Rule {
  match?: RegExp;
  replace?: (args?: any) => string;
  use?: string;
}

export interface Plugin {
  (content: string, args?: any): string;
}

export function parseRules(ruleString: string, args: object): Rule[] {
  const vm = new NodeVM({
    sandbox: args,
    console: 'off',
    eval: false,
    require: true,
    timeout: 2000,
    wrapper: 'none',
  });
  let rules = vm.run('return ' + ruleString);
  console.log(rules);
  if (!Array.isArray(rules)) {
    rules = [rules];
  }
  return rules;
}
