// [FS] IRAD-??? 2020-10-19
// Plugin to handle automatic assign unique id to the block nodes.
import {Step, StepResult} from 'prosemirror-transform';

type SetDocAttrStepJSONValue = {
  key: string;
  stepType: string;
  value: any;
};

const STEPNAME_SDA = 'SetDocAttr';

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
// Exporting the class as a named export rather than the default because it forces the name to be used consistently.
export class SetDocAttrStep extends Step {
  key: string;
  stepType: string;
  value: any;
  prevValue!: any;

  constructor(key: string, value: any, stepType: string = STEPNAME_SDA) {
    super();
    this.stepType = stepType;
    this.key = key;
    this.value = value;
  }

  apply(doc: any): StepResult {
    this.prevValue = doc.attrs[this.key];
    // avoid clobbering doc.type.defaultAttrs
    // this shall take care of focus out issue too.
    if (doc.attrs === doc.type.defaultAttrs) {
      doc.attrs = {...doc.attrs};
    }
    doc.attrs[this.key] = this.value;
    return StepResult.ok(doc);
  }

  invert(): SetDocAttrStep {
    return new SetDocAttrStep(
      this.key,
      this.prevValue,
      // 'revert' + STEPNAME_SDA
      STEPNAME_SDA
    );
  }

  // [FS] IRAD-1010 2020-07-27
  // Handle map properly so that undo works correctly for document attritube changes.
  map(): this {
    // position never changes so map should always return same step
    return this;
  }

  merge(other: SetDocAttrStep): SetDocAttrStep | null {
    if (other instanceof SetDocAttrStep) {
      return new SetDocAttrStep(this.key, this.value, STEPNAME_SDA);
    }
    return null;
  }

  toJSON(): SetDocAttrStepJSONValue {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value,
    };
  }

  static fromJSON(schema: any, json: SetDocAttrStepJSONValue): SetDocAttrStep {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }

  static register(): boolean {
    try {
      // [FS] IRAD-899 2020-03-13
      // Register this step so that document attrbute changes can be dealt collaboratively.
      Step.jsonID(STEPNAME_SDA, SetDocAttrStep);
    } catch (err) {
      if (
        !(
          err instanceof Error &&
          err.message === `Duplicate use of step JSON ID ${STEPNAME_SDA}`
        )
      ) {
        // this means something else happened, cannot use this.
        // otherwise it is already registered.
        throw err;
      }
    }
    return true;
  }
}
SetDocAttrStep.register();
