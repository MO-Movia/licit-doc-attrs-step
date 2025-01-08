import { SetDocAttrStep } from './index';
import { AddMarkStep } from 'prosemirror-transform';
import { em } from 'jest-prosemirror';
import { Mark } from 'prosemirror-model';

describe('SetDocAttrStep', () => {
  const KEY = 'uniqueKey';
  const VAL = 'uniqueValue';

  it('should construct', () => {
    const step = new SetDocAttrStep(KEY, VAL);
    expect(step).toBeTruthy();
  });

  it('should register successfully', () => {
    expect(SetDocAttrStep.register()).toEqual(true);
  });

  describe('when merging', () => {
    it('should return null when diff type of type of merged', () => {
      const markStep = new AddMarkStep(0, 1, em() as unknown as Mark);
      const sdaStep = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep.merge(markStep as unknown as SetDocAttrStep);
      expect(result).toBeNull();
    });
    it('should handle apply', () => {
      const key = 'exampleKey';
      const value = 'newValue';
      const defaultValue = 'defaultValue';
      const sharedAttrs = {
        [key]: defaultValue,
      };
      const doc = {
        attrs: {...sharedAttrs},
        type: {
          create(attrs: any, content: any = null, marks: any = null) {
            return {attrs, content, marks, type: this};
          },
        },
        content: null,
        marks: [],
      };

      const sdaStep = new SetDocAttrStep(key, value);
      const result = sdaStep.apply(doc);

      expect(result.doc).toBeDefined();

      const newDoc = result.doc;

      expect(newDoc?.attrs[key]).toBe(value);
      expect(newDoc?.attrs).not.toBe(doc.attrs);
    });

    it('should return merged step when same step type is merged', () => {
      const sdaStep1 = new SetDocAttrStep('oldkey', 'oldVal');
      const sdaStep2 = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep1.merge(sdaStep2);
      expect(result).toEqual(sdaStep1);
    });
  });
  it('should be call invert function()', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    expect(sdaStep.invert()).toBeDefined();
  });

  it('should return JSON object', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    expect(sdaStep.toJSON()).toStrictEqual({
      stepType: 'SetDocAttr',
      key: KEY,
      value: VAL,
    });
  });
});
