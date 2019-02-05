class TemplateEvaluator {
  constructor(opts = {}) {
    this.pipes = opts.pipes || {};
    // Capture groups as follows:
    // - 1: Opening template delimiter (ie. `{{`).
    // - 2: Target text.
    // - 3: Pipes or `undefined` (ie. `| foo | bar`).
    // - 4: Closing template delimiter (ie. `}}`).
    this.pattern = /({{)\s?([^{}|]+)(\|?(?:[^{}]+)?\s?)?(}})/;
    this.defaultPipe = (content, match, pipes) => content;
  }

  evaluate(str) {
    let output = str;
    let matches;

    while (matches = this.pattern.exec(output)) {
      const [match, _, content, pipes = ''] = matches;
      const sanitizedContent = content.trim();
      const sanitizedPipes = pipes.split('|')
        .map((pipe) => pipe.trim())
        .map((pipe) => this.pipes[pipe])
        .filter((pipe) => !!pipe);
      const fns = sanitizedPipes.length ? sanitizedPipes : [this.defaultPipe];

      // First pipe evaluates placeholder tokens and transforms value.
      // Subsequent pipes operate on 'evaluated' output.
      output = fns.reduce((acc, fn, i) => {
        return i
          ? fn(acc, match, this.pipes)
          : acc.replace(match, fn(sanitizedContent, match, this.pipes));
      }, output);
    }

    return output;
  }
}

module.exports = TemplateEvaluator;
