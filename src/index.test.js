import {SetDocAttrStep} from './index';
import {AddMarkStep, Step} from 'prosemirror-transform';
import {createEditor, doc, p, em} from 'jest-prosemirror';

describe('SetDocAttrStep', () => {
  const editor = createEditor(doc(p('<cursor>')));
  const KEY = 'uniqueKey';
  const VAL = 'uniqueValue';

  it('should construct', () => {
    const step = new SetDocAttrStep(KEY, VAL);
    expect(step).toBeTruthy();
  });

  it('should register', () => {});

  describe('should apply', () => {
    it('Doc attributes different from defaultAttrs', () => {
      expect(editor.state.doc.attrs[KEY]).toEqual(undefined);
      editor.state.tr.step(new SetDocAttrStep(KEY, VAL));
      expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    });

    it('Doc attributes same as defaultAttrs', () => {
      editor.state.doc.attrs = editor.state.doc.type.defaultAttrs;
      editor.state.tr.step(new SetDocAttrStep(KEY, VAL));
      expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    });
  });

  describe('should merge', () => {
    it('diff', () => {
      const markStep = new AddMarkStep(0, 1, em());
      const sdaStep = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep.merge(markStep);
      expect(result).toBeNull();
    });

    it('same', () => {
      const sdaStep1 = new SetDocAttrStep('oldkey', 'oldVal');
      const sdaStep2 = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep1.merge(sdaStep2);
      expect(result).toEqual(sdaStep1);
    });
  });

  xit('should undo', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    editor.state.tr.step(sdaStep);
    expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    editor.state.tr.step(sdaStep.invert());
    expect(editor.state.doc.attrs[KEY]).toEqual(undefined);
  });

  it('should toJSON', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    expect(sdaStep.toJSON()).toStrictEqual({
      stepType: 'SetDocAttr',
      key: KEY,
      value: VAL,
    });
  });

  xit('should register only once', () => {
    expect(SetDocAttrStep.register()).toEqual(true);
    jest.spyOn(Step, 'jsonID').mockReturnValue(new RangeError('Err'));
    expect(SetDocAttrStep.register()).toThrow(RangeError);
  });
});
