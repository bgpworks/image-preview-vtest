const turnPolicyValue = [
  "선택해주세요",
  "black",
  "white",
  "left",
  "right",
  "minority",
  "majority",
];

const booleanValue = ["선택해 주세요", "true", "false"];

const fillStrategyValue = [
  "선택해주세요",
  "FILL_DOMINANT",
  "FILL_MEAN",
  "FILL_MEDIAN",
  "FILL_SPREAD",
];

const rangeDistributionValue = ["선택해주세요", "RANGES_AUTO", "RANGES_EQUAL"];

const description = {
  turnPolicy: {
    name: "turnPolicy",
    input: false,
    options: turnPolicyValue,
    description:
      "how to resolve ambiguities in path decomposition. Possible values are exported as constants: 'black', 'white', 'left', 'right', 'minority', 'majority'",
  },
  turdSize: {
    name: "turdSize",
    input: true,
    options: "",
    description: "suppress speckles of up to this size ",
  },
  alphaMax: {
    name: "alphaMax",
    options: "",
    input: true,
    description: "corner threshold parameter",
  },
  optCurve: {
    name: "optCurve",
    options: booleanValue,
    input: false,
    description: "curve optimization",
  },
  optTolerance: {
    name: "optTolerance",
    options: "",
    input: true,
    description: "curve optimization tolerance",
  },
  threshold: {
    name: "threshold",
    options: "",
    input: true,
    description:
      "threshold below which color is considered black. Should be a number in range 0..255",
  },
  blackOnWhite: {
    name: "blackOnWhite",
    options: booleanValue,
    input: false,
    description:
      "specifies colors by which side from threshold should be turned into vector shape",
  },
  color: {
    name: "color",
    options: "",
    input: true,
    description:
      "Fill color. Will be ignored when exporting as <symbol>. (default: COLOR_AUTO, which means black or white, depending on blackOnWhite property) , tyoe: string",
  },
  background: {
    name: "background",
    options: "",
    input: true,
    description:
      "Background color. Will be ignored when exporting as <symbol>.",
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
    description: `Specifies desired number of layers in resulting image. If a number provided - thresholds for each layer will be automatically calculated according to rangeDistribution parameter. If an array provided it expected to be an array with precomputed thresholds for each layer (in range 0..255)
      (default: STEPS_AUTO which will result in 3 or 4, depending on threshold value)`,
  },
  threshold: {
    name: "threshold",
    options: "",
    input: true,
    description: `
      Breaks image into foreground and background (and only foreground being broken into desired number of layers). Basically when provided it becomes a threshold for last (least opaque) layer and then steps - 1 intermediate thresholds calculated. If steps is an array of thresholds and every value from the array is lower (or larger if blackOnWhite parameter set to false) than threshold - threshold will be added to the array, otherwise just ignored.
      `,
  },
};

export { description };
