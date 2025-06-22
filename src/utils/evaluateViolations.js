export function evaluateViolations(samples, limits) {
  const { usl, lsl, ucl, lcl } = limits;
  const parsed = {
    usl: parseFloat(usl),
    lsl: parseFloat(lsl),
    ucl: parseFloat(ucl),
    lcl: parseFloat(lcl),
  };

  return samples.map((sample, index) => {
    const sampleNum = index + 1;

    const aboveUSL = isNaN(parsed.usl) ? null : sample > parsed.usl;
    const aboveUCL = isNaN(parsed.ucl) ? null : sample > parsed.ucl;
    const belowLSL = isNaN(parsed.lsl) ? null : sample < parsed.lsl;
    const belowLCL = isNaN(parsed.lcl) ? null : sample < parsed.lcl;

    const severity =
      aboveUSL || belowLSL
        ? 'High'
        : aboveUCL || belowLCL
        ? 'Medium'
        : 'None';

    return {
      sample,
      index: sampleNum,
      aboveUSL,
      aboveUCL,
      belowLSL,
      belowLCL,
      severity,
    };
  });
}