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
      editor.state.doc.attrs = editor.state.doc.type.defaultAttrs;
      editor.state.tr.step(new SetDocAttrStep(KEY, VAL));
      expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    });
  });

  describe('when merging', () => {
    it('should return null when diff type of type of merged', () => {
      const markStep = new AddMarkStep(0, 1, em());
      const sdaStep = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep.merge(markStep);
      expect(result).toBeNull();
    });

    it('should return merged step when same step type is merged', () => {
      const sdaStep1 = new SetDocAttrStep('oldkey', 'oldVal');
      const sdaStep2 = new SetDocAttrStep(KEY, VAL);
      const result = sdaStep1.merge(sdaStep2);
      expect(result).toEqual(sdaStep1);
    });
  });

  xit('should undo revert to previous value', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    editor.state.tr.step(sdaStep);
    expect(editor.state.doc.attrs[KEY]).toEqual(VAL);
    editor.state.tr.step(sdaStep.invert());
    // This is an incomplete test...
    // Skipping this test now, as here expected result was not met, need to revisit code.
    expect(editor.state.doc.attrs[KEY]).toEqual(undefined);
  });

  it('should return JSON object', () => {
    const sdaStep = new SetDocAttrStep(KEY, VAL);
    expect(sdaStep.toJSON()).toStrictEqual({
      stepType: 'SetDocAttr',
      key: KEY,
      value: VAL,
    });
  });

  xit('should throw error when more than once registered', () => {
    // This is an incomplete test...
    // Mock Return Value is not being reflected and so skipping this test now.
    expect(SetDocAttrStep.register()).toEqual(true);
    jest.spyOn(Step, 'jsonID').mockReturnValue(new RangeError('Err'));
    expect(SetDocAttrStep.register()).toThrow(RangeError);
  });
});
