import { SetDocAttrStep } from './index';
import { AddMarkStep } from 'prosemirror-transform';
import { createEditor, doc, p, em } from 'jest-prosemirror';
import { describe, it, expect } from '@jest/globals';


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

    it('should set attibute correctly even if doc attributes different from defaultAttrs', () => {
      editor.state.doc.attrs = (editor.state.doc.type as any).defaultAttrs;
      editor.state.tr.step(new SetDocAttrStep(KEY, VAL));
      expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    });
  });

  describe('when merging', () => {
    it('should return null when diff type of type of merged', () => {
      const markStep = new AddMarkStep(0, 1, em());
      const sdaStep = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep.merge(markStep as any);
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
