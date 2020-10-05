const turnPolicyValue = [
  { name: "선택해주세요", value: "" },
  { name: "TURNPOLICY_BLACK", value: "black" },
  { name: "TURNPOLICY_WHITE", value: "white" },
  { name: "TURNPOLICY_LEFT", value: "left" },
  { name: "TURNPOLICY_RIGHT", value: "right" },
  { name: "TURNPOLICY_MINORITY", value: "minority" },
  { name: "TURNPOLICY_MAJORITY", value: "majority" },
];

const booleanValue = [
  { name: "선택해주세요", value: "" },
  { name: "true", value: true },
  { name: "false", value: false },
];

const fillStrategyValue = [
  { name: "선택해주세요", value: "" },
  { name: "FILL_DOMINANT", value: "FILL_DOMINANT" },
  { name: "FILL_MEAN", value: "FILL_MEAN" },
  { name: "FILL_MEDIAN", value: "FILL_MEDIAN" },
  { name: "FILL_SPREAD", value: "FILL_SPREAD" },
];

const rangeDistributionValue = [
  { name: "선택해주세요", value: "" },
  { name: "RANGES_AUTO", value: "RANGES_AUTO" },
  { name: "RANGES_EQUAL", value: "RANGES_EQUAL" },
];

const description = {
  turnPolicy: {
    name: "turnPolicy",
    input: false,
    options: turnPolicyValue,
    default: "default: TURNPOLICY_MINORITY",
    description: `
    how to resolve ambiguities in path decomposition. 
    Possible values are exported as constants: 'black', 'white', 'left', 'right', 'minority', 'majority'
    `,
  },
  turdSize: {
    name: "turdSize",
    input: true,
    options: "",
    default: "default: 2",
    range: "range is from 0 to infinity",
    description: `
    suppress speckles of up to this size 
    `,
  },
  alphaMax: {
    name: "alphaMax",
    options: "",
    input: true,
    default: "default: 1",
    range: "from 0.0 (polygon) to 1.3334 (no corners)",
    description: `
      corner threshold parameter .`,
  },
  optCurve: {
    name: "optCurve",
    options: booleanValue,
    input: false,
    default: "default: true",
    range: "range is from 0 to infinity",
    description: `
    curve optimization `,
  },
  optTolerance: {
    name: "optTolerance",
    options: "",
    input: true,
    default: "default: 0.2",
    range: "range is from 0 to infinity",
    description: `
    curve optimization tolerance 
    `,
  },
  threshold: {
    name: "threshold",
    options: "",
    input: true,
    default: "default: THRESHOLD_AUTO",
    range: "range is from 0 to 255",
    description: `
      threshold below which color is considered black. 
      `,
  },
  blackOnWhite: {
    name: "blackOnWhite",
    options: booleanValue,
    input: false,
    default: "default: true",
    description:
      "specifies colors by which side from threshold should be turned into vector shape ",
  },
  color: {
    name: "color",
    options: "",
    input: true,
    default: `default: COLOR_AUTO`,
    range: "Should be a string.",
    description: `
    Fill color. Will be ignored when exporting as <symbol>. 
    default: COLOR_AUTO, 
      (which means black or white, depending on blackOnWhite property)
    `,
  },
  background: {
    name: "background",
    options: "",
    input: true,
    range: "Should be a string.",
    default: "default: COLOR_TRANSPARENT",
    description: `
      Background color. Will be ignored when exporting as <symbol>. 
      Should be a string.`,
  },
  fillStrategy: {
    name: "fillStrategy",
    options: fillStrategyValue,
    input: false,
    description: `
      determines how fill color for each layer should be selected. Possible values are exported as constants:
      FILL_DOMINANT - most frequent color in range (used by default),
      FILL_MEAN - arithmetic mean (average),
      FILL_MEDIAN - median color,
      FILL_SPREAD - ignores color information of the image and just spreads colors equally in range 0..<threshold> (or <threshold>..255 if blackOnWhite is set to false),
      `,
  },
  rangeDistribution: {
    name: "rangeDistribution",
    options: rangeDistributionValue,
    input: false,
    default: "default: RANGES_AUTO",
    description: `
      how color stops for each layer should be selected. Ignored if steps is an array. Possible values are:
      RANGES_AUTO - Performs automatic thresholding (using Algorithm For Multilevel Thresholding). Preferable method for already posterized sources, but takes long time to calculate 5 or more thresholds (exponential time complexity)
      (used by default)
      RANGES_EQUAL - Ignores color information of the image and breaks available color space into equal chunks    
      `,
  },
  steps: {
    name: "steps",
    options: "",
    input: true,
    default:
      "default: STEPS_AUTO which will result in 3 or 4, depending on threshold value",
    range: "range is from 0 to 255",
    description: `
      Specifies desired number of layers in resulting image. If a number provided - thresholds for each layer will be automatically calculated according to rangeDistribution parameter. If an array provided it expected to be an array with precomputed thresholds for each layer 
      `,
  },
};

export { description };
