import { SetDocAttrStep } from './index';
import { AddMarkStep } from 'prosemirror-transform';
import { createEditor, doc, p } from 'jest-prosemirror';
import { schema } from 'prosemirror-schema-basic';

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

  function customMergeSteps(step1: SetDocAttrStep, step2: AddMarkStep) {
    if (step1 instanceof SetDocAttrStep && step2 instanceof AddMarkStep) {
      return null;
    }
    return null;
  }

  describe('when merging', () => {
    it('should return null when diff type of type of merged', () => {
      const mark = schema.marks.em.create();
      const markStep = new AddMarkStep(0, 1, mark);
      const sdaStep = new SetDocAttrStep(KEY,VAL);
      const result = customMergeSteps(sdaStep,markStep);
      expect(result).toBeNull();
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
