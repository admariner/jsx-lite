import { parseJsx } from '@/parsers/jsx';
import { Target } from '@/types/config';
import { BaseTranspilerOptions, TranspilerGenerator } from '@/types/transpiler';
import { describe, expect, test } from 'vitest';
import { MitosisComponent, Plugin, createTypescriptProject, parseSvelte } from '..';

const getRawFile = async (filePath: string) => {
  const code = await import(`${filePath}?raw`).then((x) => x.default as string);
  return { code, filePath: ['src', '__tests__', filePath].join('/') };
};

type RawFile = ReturnType<typeof getRawFile>;

const getterState = getRawFile('./data/blocks/getter-state.raw.tsx');
const advancedFor = getRawFile('./data/for/advanced-for.raw.tsx');

const basicForFragment = getRawFile('./data/for/basic-for-fragment.raw.tsx');
const basicForShow = getRawFile('./data/for/basic-for-show.raw.tsx');
const basicBooleanAttribute = getRawFile('./data/basic-boolean-attribute.raw.tsx');
const basicOnMountUpdate = getRawFile('./data/basic-onMount-update.raw.tsx');
const basicContext = getRawFile('./data/basic-context.raw.tsx');
const complexMeta = getRawFile('./data/meta/sub/complex-meta.raw.tsx');
const figmaMeta = getRawFile('./data/meta/figma/figma.raw.tsx');
const basicOutputsMeta = getRawFile('./data/basic-outputs-meta.raw.tsx');
const basicOutputs = getRawFile('./data/basic-outputs.raw.tsx');
const subComponent = getRawFile('./data/sub-component.raw.tsx');
const componentWithContext = getRawFile('./data/context/component-with-context.raw.tsx');
const componentWithContextMultiRoot = getRawFile(
  './data/context/component-with-context-multi-root.raw.tsx',
);

const basic = getRawFile('./data/basic.raw.tsx');
const classnameProps = getRawFile('./data/props/classname-props.raw.tsx');
const basicAttribute = getRawFile('./data/basic-attribute.raw.tsx');
const basicMitosis = getRawFile('./data/basic-custom-mitosis-package.raw.tsx');
const basicChildComponent = getRawFile('./data/basic-child-component.raw.tsx');
const basicFor = getRawFile('./data/for/basic-for.raw.tsx');
const basicForNoTagReference = getRawFile('./data/for/basic-for-no-tag-reference.raw.tsx');
const basicRef = getRawFile('./data/ref/basic-ref.raw.tsx');
const basicRefAttributePassing = getRawFile('./data/ref/basic-ref-attribute-passing.raw.tsx');
const basicRefAttributePassingCustomRef = getRawFile(
  './data/ref/basic-ref-attribute-passing-custom-ref.raw.tsx',
);
const normalizeLayerNames = getRawFile('./data/normalize-layer-names.raw.tsx');
const basicForwardRef = getRawFile('./data/ref/basic-forwardRef.raw.tsx');
const basicForwardRefMetadata = getRawFile('./data/ref/basic-forwardRef-metadata.raw.tsx');
const basicRefPrevious = getRawFile('./data/ref/basic-ref-usePrevious.raw.tsx');
const basicRefAssignment = getRawFile('./data/ref/basic-ref-assignment.raw.tsx');
const eventInputAndChange = getRawFile('./data/events/event-input-and-change.raw.tsx');
const propsDestructure = getRawFile('./data/props/basic-props-destructure.raw.tsx');
const eventProps = getRawFile('./data/props/event-props.raw.tsx');
const functionProps = getRawFile('./data/function-props.raw.tsx');
const nestedStyles = getRawFile('./data/nested-styles.raw.tsx');
const preserveExportOrLocalStatement = getRawFile(
  './data/basic-preserve-export-or-local-statement.raw.tsx',
);
const svgComponent = getRawFile('./data/svg.raw.tsx');
const webComponent = getRawFile('./data/basic-web-component.raw.tsx');
const propsType = getRawFile('./data/types/component-props-type.raw.tsx');
const propsInterface = getRawFile('./data/types/component-props-interface.raw.tsx');
const preserveTyping = getRawFile('./data/types/preserve-typing.raw.tsx');
const typeDependency = getRawFile('./data/types/type-dependency.raw.tsx');
const typeExternalStore = getRawFile('./data/types/type-external-store.raw.tsx');
const typeExternalProps = getRawFile('./data/types/type-external-props.raw.tsx');
const typeGetterStore = getRawFile('./data/types/type-getter-store.raw.tsx');

const defaultProps = getRawFile('./data/default-props/default-props.raw.tsx');
const defaultPropsOutsideComponent = getRawFile(
  './data/default-props/default-props-outside-component.raw.tsx',
);

const signalsOnUpdate = getRawFile('./data/signals-onUpdate.raw.tsx');

const classRaw = getRawFile('./data/styles/class.raw.tsx');
const className = getRawFile('./data/styles/className.raw.tsx');
const classAndClassName = getRawFile('./data/styles/class-and-className.raw.tsx');
const classState = getRawFile('./data/styles/classState.raw.tsx');
const useStyle = getRawFile('./data/styles/use-style.raw.tsx');
const useStyleOutsideComponent = getRawFile('./data/styles/use-style-outside-component.raw.tsx');
const useStyleAndCss = getRawFile('./data/styles/use-style-and-css.raw.tsx');
const styleClassAndCss = getRawFile('./data/styles/style-class-and-css.raw.tsx');
const stylePropClassAndCss = getRawFile('./data/styles/style-prop-class-and-css.raw.tsx');
const useTarget = getRawFile('./data/use-target.raw.tsx');
const layerName = getRawFile('./data/layer-name.raw.tsx');

const button = getRawFile('./data/blocks/button.raw.tsx');
const classNameJsx = getRawFile('./data/blocks/classname-jsx.raw.tsx');
const columns = getRawFile('./data/blocks/columns.raw.tsx');
const contentSlotHtml = getRawFile('./data/blocks/content-slot-html.raw.tsx');
const contentSlotJsx = getRawFile('./data/blocks/content-slot-jsx.raw.tsx');
const customCode = getRawFile('./data/blocks/custom-code.raw.tsx');
const formBlock = getRawFile('./data/blocks/form.raw.tsx');
const image = getRawFile('./data/blocks/image.raw.tsx');
const imageState = getRawFile('./data/blocks/img-state.raw.tsx');
const img = getRawFile('./data/blocks/img.raw.tsx');
const inputBlock = getRawFile('./data/blocks/input.raw.tsx');
const inputParentBlock = getRawFile('./data/blocks/input-parent.raw.tsx');
const multipleOnUpdate = getRawFile('./data/blocks/multiple-onUpdate.raw.tsx');
const multipleOnUpdateWithDeps = getRawFile('./data/blocks/multiple-onUpdateWithDeps.raw.tsx');
const onInit = getRawFile('./data/blocks/onInit.raw.tsx');
const onInitPlain = getRawFile('./data/blocks/onInit-plain.raw.tsx');
const onEvent = getRawFile('./data/blocks/onEvent.raw.tsx');
const onInitonMount = getRawFile('./data/blocks/onInit-onMount.raw.tsx');
const onMount = getRawFile('./data/blocks/onMount.raw.tsx');
const onMountMultiple = getRawFile('./data/blocks/onMount-multiple.raw.tsx');
const onUpdate = getRawFile('./data/blocks/onUpdate.raw.tsx');
const onUpdateWithDeps = getRawFile('./data/blocks/onUpdateWithDeps.raw.tsx');
const rawText = getRawFile('./data/blocks/raw-text.raw.tsx');
const section = getRawFile('./data/blocks/section.raw.tsx');
const sectionState = getRawFile('./data/blocks/section-state.raw.tsx');
const selectBlock = getRawFile('./data/blocks/select.raw.tsx');
const selfRefCompWChildren = getRawFile(
  './data/blocks/self-referencing-component-with-children.raw.tsx',
);
const selfRefComp = getRawFile('./data/blocks/self-referencing-component.raw.tsx');
const slotDefault = getRawFile('./data/blocks/slot-default.raw.tsx');
const slotHtml = getRawFile('./data/blocks/slot-html.raw.tsx');
const slotJsx = getRawFile('./data/blocks/slot-jsx.raw.tsx');
const slotNamed = getRawFile('./data/blocks/slot-named.raw.tsx');
const stamped = getRawFile('./data/blocks/stamped-io.raw.tsx');
const submitButtonBlock = getRawFile('./data/blocks/submit-button.raw.tsx');
const text = getRawFile('./data/blocks/text.raw.tsx');
const textarea = getRawFile('./data/blocks/textarea.raw.tsx');
const video = getRawFile('./data/blocks/video.raw.tsx');
const referencingFunInsideHook = getRawFile(
  './data/blocks/referencing-function-inside-hook.raw.tsx',
);
const renderBlock = getRawFile('./data/blocks/render-block.raw.tsx');
const multipleSpreads = getRawFile('./data/spread/multiple-spreads.raw.tsx');
const spreadAttrs = getRawFile('./data/spread/spread-attrs.raw.tsx');
const spreadNestedProps = getRawFile('./data/spread/spread-nested-props.raw.tsx');
const spreadProps = getRawFile('./data/spread/spread-props.raw.tsx');

const builderRenderContent = getRawFile('./data/blocks/builder-render-content.raw.tsx');

const rootFragmentMultiNode = getRawFile('./data/blocks/root-fragment-multi-node.raw.tsx');
const renderContentExample = getRawFile('./data/render-content.raw.tsx');
const onClickToPressable = getRawFile('./data/react-native/onclick-to-pressable.raw.tsx');
const inputToTextInputRN = getRawFile('./data/react-native/text-input.raw.tsx');

// State
const setState = getRawFile('./data/state/set-state.raw.tsx');
const expressionState = getRawFile('./data/state/expression-state.raw.tsx');
const contentState = getRawFile('./data/state/context-state.raw.tsx');

// Store
const arrowFunctionInUseStore = getRawFile('./data/store/arrow-function-in-use-store.raw.tsx');
const NestedStore = getRawFile('./data/store/nested-store.raw.tsx');
const UseValueAndFnFromStore = getRawFile('./data/store/use-value-and-fn-from-store.raw.tsx');
const StringLiteralStore = getRawFile('./data/store/string-literal-store.raw.tsx');
const StringLiteralStoreKebab = getRawFile('./data/store/string-literal-store-kebab.raw.tsx');
const StoreAsyncFunction = getRawFile('./data/store-async-function.raw.tsx');
const StoreShadowVars = getRawFile('./data/store/store-shadow-vars.raw.tsx');
const StoreWithState = getRawFile('./data/store/store-with-state.raw.tsx');
const StoreComment = getRawFile('./data/store/store-comment.raw.tsx');

// Swift
const SwiftPlainComponent = getRawFile('./data/swift/plain-component-export.raw.tsx');
const SwiftSingleQuotesReplacement = getRawFile('./data/swift/single-quotes-replacement.raw.tsx');
/**
 * Use TestsWithFailFor when you want to write a test that you know will fail
 * on certain targets. This is useful in test driven development when you want
 * to capture a test before support for a specific target has been implemented.
 */
type TestWithFailFor = { file: RawFile; failFor: Target[] };
type Tests = { [index: string]: RawFile | TestWithFailFor };
const isTestWithFailFor = (test: RawFile | TestWithFailFor): test is TestWithFailFor => {
  return 'failFor' in test;
};

const SVELTE_SYNTAX_TESTS: Tests = {
  basic: getRawFile('./syntax/svelte/basic.raw.svelte'),
  bindGroup: getRawFile('./syntax/svelte/bind-group.raw.svelte'),
  bindProperty: getRawFile('./syntax/svelte/bind-property.raw.svelte'),
  classDirective: getRawFile('./syntax/svelte/class-directive.raw.svelte'),
  context: getRawFile('./syntax/svelte/context.raw.svelte'),
  each: getRawFile('./syntax/svelte/each.raw.svelte'),
  html: getRawFile('./syntax/svelte/html.raw.svelte'),
  eventHandlers: getRawFile('./syntax/svelte/event-handlers.raw.svelte'),
  ifElse: getRawFile('./syntax/svelte/if-else.raw.svelte'),
  imports: getRawFile('./syntax/svelte/imports.raw.svelte'),
  lifecycleHooks: getRawFile('./syntax/svelte/lifecycle-hooks.raw.svelte'),
  reactive: getRawFile('./syntax/svelte/reactive.raw.svelte'),
  reactiveWithFn: getRawFile('./syntax/svelte/reactive-with-fn.raw.svelte'),
  slots: getRawFile('./syntax/svelte/slots.raw.svelte'),
  style: getRawFile('./syntax/svelte/style.raw.svelte'),
  textExpressions: getRawFile('./syntax/svelte/text-expressions.raw.svelte'),
};

const REACT_NATIVE_TESTS: Tests = {
  onClickToPressable,
  inputToTextInputRN,
};

const SWIFT_TESTS: Tests = {
  SwiftPlainComponent,
  SwiftSingleQuotesReplacement,
};

const BASIC_TESTS: Tests = {
  Basic: basic,
  BasicAttribute: basicAttribute,
  BasicBooleanAttribute: basicBooleanAttribute,
  BasicRef: basicRef,
  basicRefAttributePassing,
  basicRefAttributePassingCustomRef,
  BasicRefPrevious: basicRefPrevious,
  BasicRefAssignment: basicRefAssignment,
  BasicChildComponent: basicChildComponent,
  BasicFor: basicFor,
  basicForFragment,
  basicForNoTagReference: basicForNoTagReference,
  functionProps: functionProps,
  Input: inputBlock,
  InputParent: inputParentBlock,
  Submit: submitButtonBlock,
  Select: selectBlock,
  Button: button,
  Textarea: textarea,
  Img: img,
  Video: video,
  Section: section,
  Text: text,
  RawText: rawText,
  'Stamped.io': stamped,
  CustomCode: customCode,
  Embed: customCode,
  Image: image,
  Columns: columns,
  onUpdate: onUpdate,
  onInit: onInit,
  onInitPlain,
  onEvent,
  onUpdateWithDeps: onUpdateWithDeps,
  onMount: onMount,
  onMountMultiple,
  propsType: propsType,
  propsInterface: propsInterface,
  defaultProps: defaultProps,
  defaultPropsOutsideComponent,
  preserveTyping,
  typeDependency,
  typeExternalStore,
  typeExternalProps,
  typeGetterStore,
  defaultValsWithTypes: getRawFile('./data/types/component-with-default-values-types.raw.tsx'),
  'import types': builderRenderContent,
  subComponent,
  nestedStyles,
  eventProps,
  propsDestructure,
  'onInit & onMount': onInitonMount,
  'Basic Context': basicContext,
  'Basic Outputs Meta': basicOutputsMeta,
  complexMeta,
  figmaMeta,
  'Basic Outputs': basicOutputs,
  className: classNameJsx,
  'Image State': imageState,
  'Basic OnMount Update': basicOnMountUpdate,
  preserveExportOrLocalStatement,
  'class + css': classRaw,
  'className + css': className,
  'class + ClassName + css': classAndClassName,
  'use-style': useStyle,
  'use-style-and-css': useStyleAndCss,
  layerName,
  normalizeLayerNames,
  styleClassAndCss,
  stylePropClassAndCss,
  'use-style-outside-component': useStyleOutsideComponent,
  'self-referencing component with children': selfRefCompWChildren,
  'self-referencing component': selfRefComp,
  classnameProps,
  rootFragmentMultiNode,
  multipleSpreads,
  spreadAttrs,
  spreadNestedProps,
  spreadProps,
  renderContentExample,
  arrowFunctionInUseStore,
  setState,
  expressionState,
  contentState,
  referencingFunInsideHook,
  svgComponent,
  webComponent,
  renderBlock,
  useTarget,
  signalsOnUpdate,
  getterState,
  eventInputAndChange,
  NestedStore,
  StoreShadowVars,
  StoreWithState,
  UseValueAndFnFromStore,
  StoreComment,
  'store-async-function': StoreAsyncFunction,
  'string-literal-store': StringLiteralStore,
  'string-literal-store-kebab': {
    file: StringLiteralStoreKebab,
    failFor: [
      'alpine',
      'customElement',
      'mitosis',
      'react',
      'reactNative',
      'solid',
      'svelte',
      'swift',
      'template',
      'webcomponent',
      'stencil',
      'qwik',
      'preact',
      'lit',
      'rsc',
      'taro',
    ],
  },
};

const SLOTS_TESTS: Tests = {
  ContentSlotJSX: contentSlotJsx,
  ContentSlotHtml: contentSlotHtml,
  SlotDefault: slotDefault,
  SlotJsx: slotJsx,
  SlotHtml: slotHtml,
  SlotNamed: slotNamed,
  classState,
};

const MULTI_ON_UPDATE_TESTS: Tests = {
  multipleOnUpdate: multipleOnUpdate,
  multipleOnUpdateWithDeps: multipleOnUpdateWithDeps,
};

const FORM_BLOCK_TESTS: Tests = {
  Form: formBlock,
};

const FOR_SHOW_TESTS: Tests = {
  Section: sectionState,
  Basic: basicForShow,
  Advanced: advancedFor,
};

const FORWARD_REF_TESTS: Tests = {
  basicForwardRef,
  basicForwardRefMetadata,
};

const SHOW_TESTS: Tests = {
  rootShow: getRawFile('./data/blocks/rootShow.raw.tsx'),
  nestedShow: getRawFile('./data/show/nested-show.raw.tsx'),
  showWithFor: getRawFile('./data/show/show-with-for.raw.tsx'),
  showWithRootText: getRawFile('./data/show/show-with-root-text.raw.tsx'),
  showWithOtherValues: getRawFile('./data/show/show-with-other-values.raw.tsx'),
  showExpressions: getRawFile('./data/show/show-expressions.raw.tsx'),
};

const ADVANCED_REF: Tests = {
  AdvancedRef: getRawFile('./data/ref/advanced-ref.raw.tsx'),
};

const ON_UPDATE_RETURN: Tests = {
  basicOnUpdateReturn: getRawFile('./data/basic-onUpdate-return.raw.tsx'),
};

const IMPORT_TEST: Tests = {
  importRaw: getRawFile('./data/import.raw.tsx'),
};

const ANGULAR_TESTS: Tests = {
  prettierInline: getRawFile('./data/angular/prettier-inline.raw.tsx'),
  customSelector: getRawFile('./data/angular/custom-selector.raw.tsx'),
  nativeAttributes: getRawFile('./data/angular/native-attributes.raw.tsx'),
  outputEventBinding: getRawFile('./data/angular/output-event-bindings.raw.tsx'),
  dynamicComponent: getRawFile('./data/angular/dynamic-component.raw.tsx'),
  dynamicComponentWithEventArg: getRawFile(
    './data/angular/dynamic-component-with-event-args.raw.tsx',
  ),
  twoForsTrackBy: getRawFile('./data/angular/two-fors.raw.tsx'),
  stateInit: getRawFile('./data/angular/state-init.raw.tsx'),
  stateInitSequence: getRawFile('./data/angular/state-init-sequence.raw.tsx'),
  useObjectWrapper: getRawFile('./data/angular/use-object-wrapper.raw.tsx'),
  allSpread: getRawFile('./data/angular/all-spread.raw.tsx'),
  changeDetection: getRawFile('./data/angular/change-detection.raw.tsx'),
  sanitizeInnerHTML: getRawFile('./data/angular/sanitize-inner-html.raw.tsx'),
  signals: getRawFile('./data/angular/signals-test.raw.tsx'),
};

const CONTEXT_TEST: Tests = {
  componentWithContext,
  componentWithContextMultiRoot,
};

const JSX_TESTS: Tests[] = [
  BASIC_TESTS,
  SLOTS_TESTS,
  SHOW_TESTS,
  FORWARD_REF_TESTS,
  MULTI_ON_UPDATE_TESTS,
  FORM_BLOCK_TESTS,
  ADVANCED_REF,
  ON_UPDATE_RETURN,
  FOR_SHOW_TESTS,
  CONTEXT_TEST,
];

const JSX_TESTS_FOR_TARGET: Partial<Record<Target, Tests[]>> = {
  alpine: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS, // Slots not implemented
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  react: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    // FOR_SHOW_TESTS,
  ],
  rsc: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    // FOR_SHOW_TESTS,
  ],
  angular: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    IMPORT_TEST,
    ANGULAR_TESTS,
  ],
  lit: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  marko: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  mitosis: [
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    FOR_SHOW_TESTS,
    CONTEXT_TEST,
  ],
  webcomponent: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    // FORM_BLOCK_TESTS
  ],
  vue: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  svelte: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  html: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    // FORM_BLOCK_TESTS
  ],
  stencil: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    FOR_SHOW_TESTS,
  ],
  solid: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  reactNative: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
    REACT_NATIVE_TESTS,
    // FOR_SHOW_TESTS,
  ],
  liquid: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  qwik: [
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    FOR_SHOW_TESTS,
  ],
  taro: [
    CONTEXT_TEST,
    BASIC_TESTS,
    SLOTS_TESTS,
    SHOW_TESTS,
    FORWARD_REF_TESTS,
    MULTI_ON_UPDATE_TESTS,
    FORM_BLOCK_TESTS,
    ADVANCED_REF,
    ON_UPDATE_RETURN,
  ],
  swift: [
    // CONTEXT_TEST,
    SWIFT_TESTS,
    // BASIC_TESTS,
    // SLOTS_TESTS,
    // SHOW_TESTS,
    // FORWARD_REF_TESTS,
    // MULTI_ON_UPDATE_TESTS,
    // FORM_BLOCK_TESTS,
    // ADVANCED_REF,
    // ON_UPDATE_RETURN,
    // FOR_SHOW_TESTS,
  ],
};

const metaDataPlugin: Plugin = () => ({
  code: {
    pre: (code: string, json: MitosisComponent) => {
      if (json.meta.useMetadata) {
        return `
          /**
          useMetadata:
          ${JSON.stringify(json.meta.useMetadata)}
          */

          ${code}`;
      }

      return code;
    },
  },
});

export const runTestsForJsx = () => {
  test('Remove Internal mitosis package', async () => {
    const component = parseJsx((await basicMitosis).code, {
      compileAwayPackages: ['@dummy/custom-mitosis'],
    });
    expect(component).toMatchSnapshot();
  });

  const configurations: Array<Parameters<typeof parseJsx>[1] & { testName: string }> = [
    { typescript: true, testName: 'Typescript' },
    { typescript: false, testName: 'Javascript' },
  ];

  configurations.forEach((config) => {
    describe(config.testName, () => {
      JSX_TESTS.forEach((tests) => {
        Object.keys(tests).forEach((key) => {
          test(key, async () => {
            const singleTest = tests[key];
            const testPromise = isTestWithFailFor(singleTest) ? singleTest.file : singleTest;
            const t = await testPromise;
            const component = parseJsx(t.code, { ...config, filePath: t.filePath });
            expect(component).toMatchSnapshot();
          });
        });
      });
    });
  });
};
export const runTestsForSvelteSyntax = () => {
  Object.keys(SVELTE_SYNTAX_TESTS).forEach((key) => {
    test(key, async () => {
      const singleTest = SVELTE_SYNTAX_TESTS[key];
      const t = isTestWithFailFor(singleTest) ? singleTest.file : singleTest;
      const component = await parseSvelte((await t).code);
      expect(component).toMatchSnapshot();
    });
  });
};

const tsProject = createTypescriptProject(__dirname + '/tsconfig.json');

const filterTests = (testArray?: Tests[], only?: string[]) =>
  testArray?.map((tests: Tests) => {
    if (!only) {
      return tests;
    }

    const filteredTests: Tests = {};

    Object.entries(tests).forEach(([key, test]) => {
      if (only.some((o) => o.toLowerCase() === key.toLowerCase())) {
        filteredTests[key] = test;
      }
    });

    return filteredTests;
  });

export const runTestsForTarget = <X extends BaseTranspilerOptions>({
  target,
  generator,
  options,
  only,
  logOutput,
}: {
  target: Target;
  generator: TranspilerGenerator<X>;
  options: X;
  logOutput?: boolean;
  only?: string[]; // Test only some tests based on key
}) => {
  const configurations: { options: X; testName: string }[] = only
    ? [
        {
          options: { ...options, plugins: [metaDataPlugin] },
          testName: 'Only Test',
        },
      ]
    : [
        {
          options: { ...options, typescript: false, plugins: [metaDataPlugin] },
          testName: 'Javascript Test',
        },
        {
          options: { ...options, typescript: true, plugins: [metaDataPlugin] },
          testName: 'Typescript Test',
        },
      ];

  type ParserConfig = {
    name: 'jsx' | 'svelte';
    parser: (args: { code: string; filePath: string }) => Promise<MitosisComponent>;
    testsArray?: Tests[];
  };

  configurations.forEach(({ options, testName }) => {
    const parsers: ParserConfig[] = [
      {
        name: 'jsx',
        parser: async ({ code, filePath }) =>
          parseJsx(
            code,
            options.typescript
              ? {
                  typescript: true,
                  filePath,
                  tsProject,
                }
              : {
                  typescript: false,
                  filePath,
                },
          ),
        testsArray: filterTests(JSX_TESTS_FOR_TARGET[target], only),
      },
      {
        name: 'svelte',
        parser: async ({ code }) => parseSvelte(code),
        testsArray: filterTests([SVELTE_SYNTAX_TESTS], only),
      },
    ];
    for (const { name, parser, testsArray } of parsers) {
      if (testsArray && (only || Object.keys(testsArray[0]).length > 0)) {
        describe(name, () => {
          if (!only) {
            if (name === 'jsx' && options.typescript === false) {
              test('Remove Internal mitosis package', async () => {
                const t = await basicMitosis;
                const component = parseJsx(t.code, {
                  compileAwayPackages: ['@dummy/custom-mitosis'],
                  filePath: t.filePath,
                });
                const output = generator(options)({ component, path: t.filePath });
                expect(output).toMatchSnapshot();
              });
            }
          }
          describe(testName, () => {
            testsArray.forEach((tests) => {
              Object.keys(tests).forEach((key) => {
                const singleTest = tests[key];
                const shouldFail =
                  isTestWithFailFor(singleTest) && singleTest.failFor.includes(target);
                test(key, async () => {
                  const t = isTestWithFailFor(singleTest)
                    ? await singleTest.file
                    : await singleTest;
                  const component = await parser(t);
                  const getOutput = () => generator(options)({ component, path: t.filePath });
                  if (shouldFail) {
                    expect(getOutput).toThrowError();
                  } else {
                    try {
                      const output = getOutput();
                      if (logOutput) {
                        process.stdout.write(`--- Start: ${key} ---\n\n`);
                        process.stdout.write(output);
                        process.stdout.write(`--- End: ${key} ---\n\n`);
                      }
                      expect(output).toMatchSnapshot();
                    } catch (error) {
                      if (logOutput) {
                        throw error;
                      } else {
                        expect(getOutput).toThrowErrorMatchingSnapshot();
                      }
                    }
                  }
                });
              });
            });
          });
        });
      }
    }
  });
};
