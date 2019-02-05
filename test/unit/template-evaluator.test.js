const { expect } = require('chai');

const { TemplateEvaluator } = require('../../src');

describe('TemplateEvaluator', () => {
  describe('General', () => {
    it('should be importable', () => {
      expect(TemplateEvaluator).to.be.a('function');
    });

    it('should be constructable', () => {
      expect(new TemplateEvaluator()).to.be.an.instanceof(TemplateEvaluator);
    });
  });

  describe('cosntructor()', () => {
    it('should set the `pipes` property using the data provided', () => {
      const pipes = { a: 'b' };

      expect(new TemplateEvaluator({ pipes }).pipes).to.eq(pipes);
    });

    it('should set the `pipes` property to an object literal by default', () => {
      expect(new TemplateEvaluator().pipes).to.eql({});
    });

    it('should set the `pattern` property', () => {
      expect(new TemplateEvaluator().pattern).to.be.an.instanceof(RegExp);
    });

    it('should set the `defaultPipe` property', () => {
      expect(new TemplateEvaluator().defaultPipe).to.be.a('function');
    });
  });

  describe('Instance methods', () => {
    let instance;

    beforeEach(() => {
      instance = new TemplateEvaluator();
    });

    describe('evaluate()', () => {
      it('should be a function', () => {
        expect(instance.evaluate).to.be.a('function');
      });

      it('should return a string', () => {
        expect(instance.evaluate('foo')).to.be.a('string');
      });

      it('should evaluate a template string', () => {
        expect(instance.evaluate('{{ foo }}')).to.eq('foo');
      });

      it('should invoke the matched pipe function', () => {
        const v = '__BAR__';
        instance.pipes.bar = () => v;

        expect(instance.evaluate('{{ foo | bar }}')).to.eq(v);

        delete instance.pipes.bar;
      });

      it('should invoke the default pipe function', () => {
        const v = '__BAZ__';
        const originalDefaultPipe = instance.defaultPipe;
        instance.defaultPipe = () => v;

        expect(instance.evaluate('{{ foo | bar }}')).to.eq(v);

        instance.defaultPipe = instance.defaultPipe;
      });
    });
  });
});
