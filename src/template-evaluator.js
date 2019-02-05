class TemplateEvaluator {
  constructor(opts = {}) {
    this.pipes = opts.pipes || {};
    this.pattern = /({{)\s?([^{}|]+)\|?([^{}]+)?\s?(}})/;
    this.defaultPipe = (content, match, pipes) => content;
  }

  evaluate(str) {
    let output = str;
    let matches;

    while (matches = this.pattern.exec(output)) {
      const [match, _, content, pipe = ''] = matches;
      const sanitizedContent = content.trim();
      const sanitizedPipe = pipe.trim();
      const fn = this.pipes[sanitizedPipe] || this.defaultPipe;

      output = output.replace(match, fn(sanitizedContent, match, this.pipes));
    }

    return output;
  }
}

module.exports = TemplateEvaluator;
