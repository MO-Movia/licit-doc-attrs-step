import { SetDocAttrStep } from './index';
import { AddMarkStep } from 'prosemirror-transform';
import { createEditor, doc, p, em } from 'jest-prosemirror';
import { Mark } from 'prosemirror-model';

describe('SetDocAttrStep', () => {
  const editor = createEditor(doc(p('<cursor>')));
  const KEY = 'uniqueKey';
  const VAL = 'uniqueValue';

  it('should construct', () => {
    const step = new SetDocAttrStep(KEY, VAL);
    expect(step).toBeTruthy();
  });

  it('should register successfully', () => {
    expect(SetDocAttrStep.register()).toEqual(true);
  });

  describe('when applying', () => {
    it('should set attibute correctly even if doc attributes different from defaultAttrs', () => {
      expect(editor.state.doc.attrs[KEY]).toEqual(undefined);
      editor.state.tr.step(new SetDocAttrStep(KEY, VAL));
      expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    });
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
        [key]: defaultValue
      };
      const doc = {
        attrs: sharedAttrs,
        type: {
          defaultAttrs: sharedAttrs
        }
      };
      const sdaStep = new SetDocAttrStep(KEY, VAL);
      sdaStep.apply.call({ key, value }, doc);
      expect(doc.attrs[key]).toBe(value);
      expect(doc.type.defaultAttrs[key]).toBe(defaultValue);
      expect(doc.attrs).not.toBe(doc.type.defaultAttrs);
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
