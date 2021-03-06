

var objectID = 0;

const oscMap = {
  '@sin': "sinewave",
  "@saw": "saw",
  "@square": "square",
  "@tri": "triangle",
  "@pha": "phasor"
};

const jsFuncMap = {
	saw: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.saw(${p[0].loop})`
	},
	sin: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.sinewave(${p[0].loop})`
	},
	tri: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.triangle(${p[0].loop})`
	},
	pha: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.phasor(${p[0].loop})`
	},
	ph2: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 3 ? p[3].loop : 0.0});`,
		loop:  (o, p) => `${o}.phasor(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	sqr: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.square(${p[0].loop})`
	},
	pul: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 2 ? p[2].loop : 0.0});`,
		loop:  (o, p) => `${o}.pulse(${p[0].loop},${p[1].loop})`
	},
	imp: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.impulse(${p[0].loop})`
	},
	sawn: {
		setup: (o, p) => `${o} = new Module.maxiOsc();
                      ${o}.phaseReset(${p.length > 1 ? p[1].loop : 0.0});`,
		loop:  (o, p) => `${o}.sawn(${p[0].loop})`
	},
	noiz: {
		setup: (o, p) => `${o} = new Module.maxiOsc()`,
		loop:  (o, p) => `${o}.noise()*${p[0].loop}`
	},
	gt: {
		setup: (o, p) => "",
		loop:  (o, p) => `(${p[0].loop} > ${p[1].loop}) ? 1 : 0`
	},
	lt: {
		setup: (o, p) => "",
		loop:  (o, p) => `(${p[0].loop} < ${p[1].loop}) ? 1 : 0`
	},
	mod: {
    setup: (o, p) => "",
    loop:  (o, p) => `(${p[0].loop} % ${p[1].loop})` },
	add: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.add(${p[0].loop},${p[1].loop})`
	},
	mul: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.mul(${p[0].loop},${p[1].loop})`
	},
	sub: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.sub(${p[0].loop},${p[1].loop})`
	},
	div: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.div(${p[0].loop},${p[1].loop})`
	},
	pow: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.pow(${p[0].loop},${p[1].loop})`
	},
	abs: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMath.abs(${p[0].loop})`
	},
	env: {
		setup: (o, p) => `${o} = new Module.maxiEnv();
                      ${o}.setAttack(${p[1].loop});
                      ${o}.setDecay(${p[2].loop});
                      ${o}.setSustain(${p[3].loop});
                      ${o}.setRelease(${p[4].loop})`,
		loop:  (o, p) => `${o}.adsr(1,${p[0].loop})`
	},
	sum: {
		setup: (o, p) => "",
		loop:  (o, p) => {
      let s = `(${p[0].loop}`;
			for (let i = 1; i < p.length; i++)
        s += `+${p[i].loop}`;
			return s + ")";	}
	},
	mix: {
		setup: (o, p) => "",
		loop:  (o, p) => {
			let s = `((${p[0].loop}`;
			for (let i = 1; i < p.length; i++)
        s += `+${p[i].loop}`;
			return s + `)/${p.length})`;
		}
	},
	prod: {
		setup: (o, p) => "",
		loop:  (o, p) => {
			let s = `(${p[0].loop}`;
			for (let i = 1; i < p.length; i++)
        s += `*${p[i].loop}`;
			return s + ")";
		}
	},
	blin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`
	},
	ulin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, 0, 1, ${p[1].loop}, ${p[2].loop})`
	},
	bexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`
	},
	uexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, 0.0000001, 1, ${p[1].loop}, ${p[2].loop})`
	},
	linlin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`
	},
	linexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, ${p[1].loop}, ${p[2].loop}), ${p[3].loop}, ${p[4].loop})`
	},
	dist: {
		setup: (o, p) => `${o} = new Module.maxiDistortion()`,
		loop:  (o, p) => `${o}.atanDist(${p[0].loop},${p[1].loop})`
	},
	flange: {
		setup: (o, p) => `${o} = new Module.maxiFlanger()`,
		loop:  (o, p) => `${o}.flange(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`
	},
	chor: {
		setup: (o, p) => `${o} = new Module.maxiChorus()`,
		loop:  (o, p) => `${o}.chorus(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`
	},
	dl: {
		setup: (o, p) => `${o} = new Module.maxiDelayline()`,
		loop:  (o, p) => `${o}.dl(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	lpf: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.lopass(${p[0].loop},${p[1].loop})`
	},
	hpf: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.hipass(${p[0].loop},${p[1].loop})`
	},
	lpz: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.lores(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	hpz: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.hires(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	toJS: {
		setup: (o, p) => `${o} = this.registerTransducer('${o}', ${p[0].loop})`,
		loop:  (o, p) => `${o}.send(${p[1].loop}, ${p[2].loop})`
	},
	fromJS: {
		setup: (o, p) => `${o} = this.registerTransducer('${o}', ${p[0].loop})`,
		loop:  (o, p) => `${o}.receive(${p[1].loop})`
	},
	// 'adc': {"setup":(o,p)=>"", "loop":(o,p)=>`inputs[${p[0].loop}]`},
	// adc: { setup: (o, p) => "", loop: (o, p) => `inputs` },
	// sampler: {
	// 	setup: (o, p) => `${o} = new Module.maxiSample();
  //                     ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
	// 	loop:  (o, p) => `(${o}.isReady() ? ${o}.playOnZX(${p[0].loop}) : 0.0)`
	// },
	// loop: {
	// 	setup: (o, p) => `${o} = new Module.maxiSample();
  //                     ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
	// 	loop:  (o, p) => `(${o}.isReady() ? ${o}.play(${p[0].loop}) : 0.0)`
	// },
	oscin: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.OSCTransducer(${p[0].loop},${p[1].loop})`
	},
	oscout: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.OSCTransducer(${p[0].loop},${p[1].loop})`
	},
	sah: {
		setup: (o, p) => `${o} = new Module.maxiSampleAndHold();`,
		loop:  (o, p) => `${o}.sah(${p[0].loop},${p[1].loop})`
	},
	stretch: {
		setup: (o, p) => `${o} = new Module.maxiSample();
                      ${o}.setSample(this.getSampleBuffer(${p[4].loop}));
                      ${o}stretch = new Module.maxiStretch();
                      ${o}stretch.setSample(${o});`,
		loop:  (o, p) => `(${o}.isReady() ? ${o}stretch.play(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},0.0) : 0.0)`
	},
  blin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`
	},
	ulin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, 0, 1, ${p[1].loop}, ${p[2].loop})`
	},
	bexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`
	},
	uexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, 0.0000001, 1, ${p[1].loop}, ${p[2].loop})`
	},
	linlin: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linlin(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`
	},
	linexp: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiMap.linexp(${p[0].loop}, ${p[1].loop}, ${p[2].loop}), ${p[3].loop}, ${p[4].loop})`
	},
	dist: {
		setup: (o, p) => `${o} = new Module.maxiDistortion()`,
		loop:  (o, p) => `${o}.atanDist(${p[0].loop},${p[1].loop})`
	},
	flange: {
		setup: (o, p) => `${o} = new Module.maxiFlanger()`,
		loop:  (o, p) => `${o}.flange(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`
	},
	chor: {
		setup: (o, p) => `${o} = new Module.maxiChorus()`,
		loop:  (o, p) => `${o}.chorus(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`
	},
	dl: {
		setup: (o, p) => `${o} = new Module.maxiDelayline()`,
		loop:  (o, p) => `${o}.dl(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	lpf: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.lopass(${p[0].loop},${p[1].loop})`
	},
	hpf: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.hipass(${p[0].loop},${p[1].loop})`
	},
	lpz: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.lores(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	hpz: {
		setup: (o, p) => `${o} = new Module.maxiFilter()`,
		loop:  (o, p) => `${o}.hires(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
	toJS: {
		setup: (o, p) => `${o} = this.registerTransducer('${o}', ${p[0].loop})`,
		loop:  (o, p) => `${o}.send(${p[1].loop}, ${p[2].loop})`
	},
	fromJS: {
		setup: (o, p) => `${o} = this.registerTransducer('${o}', ${p[0].loop})`,
		loop:  (o, p) => `${o}.receive(${p[1].loop})`
	},
	// 'adc': {"setup":(o,p)=>"", "loop":(o,p)=>`inputs[${p[0].loop}]`},
	adc: { setup: (o, p) => "", loop: (o, p) => `inputs` },
	sampler: {
		setup: (o, p) => `${o} = new Module.maxiSample();
                      ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
		loop:  (o, p) => `(${o}.isReady() ? ${o}.playOnZX(${p[0].loop}) : 0.0)`
	},
  loop: {
		setup: (o, p) => `${o} = new Module.maxiSample();
                      ${o}.setSample(this.getSampleBuffer(${p[1].loop}));`,
		loop:  (o, p) => `(${o}.isReady() ? ${o}.play(${p[0].loop}) : 0.0)`
	},
  slice: {
		setup: (o, p) => `${o} = new Module.maxiSample();
                      ${o}.setSample(this.getSampleBuffer(${p[2].loop}));`,
		loop:  (o, p) => `(${o}.isReady() ? ${o}.loopSetPosOnZX(${p[0].loop},${p[1].loop}) : 0.0)`
	},
	oscin: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.OSCTransducer(${p[0].loop},${p[1].loop})`
	},
	oscout: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.OSCTransducer(${p[0].loop},${p[1].loop})`
	},
	sah: {
		setup: (o, p) => `${o} = new Module.maxiSampleAndHold();`,
		loop:  (o, p) => `${o}.sah(${p[0].loop},${p[1].loop})`
	},
	stretch: {
		setup: (o, p) => `${o} = new Module.maxiSample();
                      ${o}.setSample(this.getSampleBuffer(${p[4].loop}));
                      ${o}stretch = new Module.maxiStretch();
                      ${o}stretch.setSample(${o});`,
		loop:  (o, p) => `(${o}.isReady() ? ${o}stretch.play(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},0.0) : 0.0)`
	},
  bitToSig: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.toSignal(${p[0].loop})`
	},
  bitToTrigSig: {
  		setup: (o, p) => "",
  		loop:  (o, p) => `Module.maxiBits.toTrigSignal(${p[0].loop})`
  	},
  bitNeg: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.neg(${p[0].loop})`
	},
  bitInc: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.inc(${p[0].loop})`
	},
  bitDec: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.dec(${p[0].loop})`
	},
  bitAnd: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.land(${p[0].loop},${p[1].loop})`
	},
  bitOr: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.lor(${p[0].loop},${p[1].loop})`
	},
  bitXor: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.lxor(${p[0].loop},${p[1].loop})`
	},
  bitShl: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.shl(${p[0].loop},${p[1].loop})`
	},
  bitShr: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.shr(${p[0].loop},${p[1].loop})`
	},
  bitAt: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.at(${p[0].loop},${p[1].loop})`
	},
  bitAdd: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.add(${p[0].loop},${p[1].loop})`
	},
  bitSub: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.sub(${p[0].loop},${p[1].loop})`
	},
  bitMul: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.mul(${p[0].loop},${p[1].loop})`
	},
  bitEq: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.eq(${p[0].loop},${p[1].loop})`
	},
  bitGt: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.gt(${p[0].loop},${p[1].loop})`
	},
  bitGte: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.gte(${p[0].loop},${p[1].loop})`
	},
  bitLte: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.lte(${p[0].loop},${p[1].loop})`
	},
  bitLt: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.lt(${p[0].loop},${p[1].loop})`
	},
  setup: (o, p) => "",
  bitDiv: {
		loop:  (o, p) => `Module.maxiBits.div(${p[0].loop},${p[1].loop})`
	},
  bitr: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.at(${p[0].loop},${p[1].loop},${p[2].loop})`
	},
  bitnoise: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.noise()`
	},
  btime: {
		setup: (o, p) =>``,
		loop:  (o, p) => `this.bitTime`
	},
  bitFromSig: {
		setup: (o, p) => "",
		loop:  (o, p) => `Module.maxiBits.fromSignal(${p[0].loop})`
	},
  clp: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.clockPhase(${p[0].loop},${p.length > 1 ? p[1].loop : 0})`
	},
  clt: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.clockTrig(${p[0].loop},${p.length > 1 ? p[1].loop : 0})`
	},
  clfreq: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.setClockFreq(${p[0].loop})`
	},
  clbpm: {
		setup: (o, p) => "",
		loop:  (o, p) => `this.setClockFreq(60/${p[0].loop})`
	},
  onzx: {
		setup: (o, p) => `${o} = new Module.maxiTrigger();`,
		loop:  (o, p) => `${o}.onZX(${p[0].loop})`
	},
  onchange: {
		setup: (o, p) => `${o} = new Module.maxiTrigger();`,
		loop:  (o, p) => `${o}.onChanged(${p[0].loop},${p[1].loop})`
	},
  count: {
		setup: (o, p) => `${o} = new Module.maxiCounter();`,
		loop:  (o, p) => `${o}.count(${p[0].loop},${p[1].loop})`
	},
  idx: {
		setup: (o, p) => `${o} = new Module.maxiIndex();`,
		loop:  (o, p) => `${o}.pull(${p[0].loop},${p[1].loop},${p[2].loop})`
  },
  svf: {
    //set cutoff and resonance only when params change to save CPU
		setup: (o, p) => `${o} = new Module.maxiSVF(); ${o}_p1 = new Module.maxiTrigger(); ${o}_p2 = new Module.maxiTrigger();`,
		loop:  (o, p) => `(()=>{${o}_cutoff = ${p[1].loop}; if (${o}_p1.onChanged(${o}_cutoff, 1e-5)) {${o}.setCutoff(${o}_cutoff)};
                            ${o}_res = ${p[2].loop}; if (${o}_p2.onChanged(${o}_res, 1e-5)) {${o}.setResonance(${o}_res)};
                        return ${o}.play(${p[0].loop},${p[3].loop},${p[4].loop},${p[5].loop},${p[6].loop})})()`
  },
  bitclock: {
    setup: (o, p) => "",
		loop:  (o, p) => `this.bitclock`
  },
  pvshift: {
		setup: (o, p) => `${o} = new pvshift();`,
		loop:  (o, p) => `${o}.play(${p[0].loop},${p[1].loop})`
	},
};

class IRToJavascript {

  static getNextID() {
    objectID = objectID > 9999 ? 0 : ++objectID;
    return objectID;
  }

  static emptyCode() {
    return {
      "setup": "",
      "loop": "",
      "paramMarkers": []
    };
  }

  static traverseTree(t, code, level, vars) {
    // console.log(`DEBUG:IR:traverseTree:level: ${level}`);
    // console.log(`DEBUG:IR:traverseTree:vars:`);
    // console.log(vars);
    let attribMap = {
      '@lang': (ccode, el) => {
        let statements = [];
        el.map((langEl) => {
          let statementCode = IRToJavascript.traverseTree(langEl, IRToJavascript.emptyCode(), level, vars);
          // console.log("@lang: " + statementCode.loop);
          ccode.setup += statementCode.setup;
          ccode.loop += statementCode.loop;
          // ccode.paramMarkers
        });
        return ccode;
      },
      '@sigOut': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        ccode.loop = `q.sigOut = ${ccode.loop};`;
        return ccode;
      },
      '@spawn': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        ccode.loop += ";";
        return ccode;
      },
      '@sigp': (ccode, el) => {
        let paramMarkers = [{"s":el['paramBegin'], "e":el['paramEnd'], "l":level}]
        ccode.paramMarkers = ccode.paramMarkers.concat(paramMarkers);

        let functionName = el['@func'].value;
        let funcInfo = jsFuncMap[functionName];
        let objName = "q.u" + IRToJavascript.getNextID();

        let allParams=[];

        for (let p = 0; p < el['@params'].length; p++) {
          let params = IRToJavascript.emptyCode();
          params = IRToJavascript.traverseTree(el['@params'][p], params, level+1, vars);
          // console.log(params);
          allParams[p] = params;
        }
        // console.log(allParams);
        let setupCode = "";
        for (let param in allParams) {
          setupCode += allParams[param].setup;
          ccode.paramMarkers = ccode.paramMarkers.concat(allParams[param].paramMarkers);
        }
        ccode.setup += `${setupCode} ${funcInfo.setup(objName, allParams)};`;
        ccode.loop += `${funcInfo.loop(objName, allParams)}`;
        return ccode;
      },
      '@setvar': (ccode, el) => {
        // console.log("DEBUG:traverseTree:@setvar");
        // console.log(vars);
        // console.log(el['@varname']);
        let variableName = el['@varname'].value;
        // console.log(variableName);
        let memIdx = vars[variableName];
        // console.log(memIdx);
        if (memIdx == undefined) {
          // console.log("var not found");
          memIdx = Object.keys(vars).length;
          vars[variableName] = memIdx;
          // console.log(memIdx);
        }
        let varValueCode = IRToJavascript.traverseTree(el['@varvalue'], IRToJavascript.emptyCode(), level+1, vars);
        ccode.setup += varValueCode.setup;
        // ccode.loop = `this.setvar(q, '${el['@varname']}', ${varValueCode.loop})`;
        ccode.loop = `(mem[${memIdx}] = ${varValueCode.loop})`;
        return ccode;
      },
      '@getvar': (ccode, el) => {
        let memIdx = vars[el.value];
        if (memIdx == undefined) {
          memIdx = Object.keys(vars).length;
          vars[el.value] = memIdx;
        }
        // ccode.loop += `this.getvar(q, '${el.value}')`;
        ccode.loop += `mem[${memIdx}]`;
        return ccode;
      },
      '@string': (ccode, el) => {
        if (typeof el === 'string' || el instanceof String) {
          // console.log("String: " + el);
          ccode.loop += `'${el}'`;
        } else {
          ccode = IRToJavascript.traverseTree(el, ccode, level, vars);
        }
        return ccode;
      },
      '@num': (ccode, el) => {
        if (el.value) {
          ccode.loop += `${el.value}`;
        }
        //  else {
        //   ccode = IRToJavascript.traverseTree(el, ccode, level);
        // }
        return ccode;
      },
      '@list': (ccode, el) => {
        //a list can be static and/or dynamic
        //create a vector for the list
        let objName = "q.l" + IRToJavascript.getNextID();
        ccode.setup += `${objName} = new Module.VectorDouble();`;
        ccode.setup += `${objName}.resize(${el.length},0);`;

        //in the loop, we create a function that returns the list. It might also update dynamic elements of the list
        ccode.loop += `(()=>{`;
        let extraSetupCode = "";

        for(let i_list=0; i_list < el.length; i_list++) {
          //if the element is a static number, set this element once in the setup code
          let element =  IRToJavascript.traverseTree(el[i_list], IRToJavascript.emptyCode(), level, vars);
          if(Object.keys(el[i_list])[0] == '@num') {
              ccode.setup += `${objName}.set(${i_list}, ${element.loop});`;
          }else{
              //if the element not a number, set this element each update before returning the list
              extraSetupCode += element.setup;
              ccode.loop += `${objName}.set(${i_list}, ${element.loop});`;
          }
        }

        ccode.loop += `return ${objName}})()`;
        ccode.setup += extraSetupCode;
        // ccode.loop+=`${objName}`;
        console.log(ccode);
        return ccode;
      }
    }

    if (Array.isArray(t)) {
      t.map((el) => {
        Object.keys(el).map((k) => {
          // console.log("DEBUG:traverseTree:@ARRAYAttribMap");
          // console.log(k);
          code = attribMap[k](code, el[k]);
        });
      })
    } else {
      Object.keys(t).map((k) => {
        // console.log("DEBUG:traverseTree:@OBJECTAttribMap");
        // console.log(k);
        code = attribMap[k](code, t[k]);
      });
    }
    return code;
  }

  static treeToCode(tree) {
    // console.log(tree);
    let vars = {};
    console.log("1");
    let code = IRToJavascript.traverseTree(tree, IRToJavascript.emptyCode(), 0, vars);
    console.log("2");
    code.setup = `() => {let q=this.newq(); ${code.setup}; return q;}`;
    code.loop = `(q, inputs, mem) => {${code.loop} return q.sigOut;}`
    console.log("DEBUG:treeToCode");
    console.log(code.loop);
    // console.log(code.paramMarkers);
    return code;
  }
}

export default IRToJavascript;
