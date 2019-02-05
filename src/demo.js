const TemplateEvaluator = require('./template-evaluator');

const evaluator = new TemplateEvaluator({
  pipes: {
    info: (content, match, pipes) => `<span class="info">${content}</span>`,
    cost: (content, match, pipes) => `<span class="cost">${content}</span>`,
  },
});

const str = '{{ {{ First Born | info }} | cost }}';

console.log(evaluator.evaluate(str));
