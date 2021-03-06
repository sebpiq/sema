<script context="module">
  const is_browser = typeof window !== "undefined";

  import CodeMirror, { set, update } from "svelte-codemirror";
  import "codemirror/lib/codemirror.css";

  if (is_browser) {
    import("../../utils/codeMirrorPlugins");
  }
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
  import {
    grammarCompiledParser,
    liveCodeEditorValue,
    liveCodeParseErrors,
    liveCodeParseResults,
    liveCodeAbstractSyntaxTree,
    dspCode
  } from "../../store.js";

  import {addToHistory} from "../../utils/history.js";

  // import {
  //   playAudio,
  //   stopAudio,
  //   evalDSP
  // } from '../../audioEngine/audioEngineController.js'

  import { PubSub } from '../../messaging/pubSub.js';

  import IRToJavascript from "../../intermediateLanguage/IR.js";

  import ParserWorker from "worker-loader!../../workers/parser.worker.js";

  export let value = "";

  let codeMirror;
  let parserWorker;
  let messaging = new PubSub();

  onMount(async () => {
    codeMirror.set(value, "js", 'monokai');

    parserWorker = new ParserWorker();  // Create one worker per widget lifetime
	});

  onDestroy(async () => {
    parserWorker.terminate();
    parserWorker = null; // cannot delete in strict mode
	});

  let log = (e) => { console.log(e.detail.value); }

  let nil = (e) => { }


  let parseLiveCodeAsync = e => {
    // console.log('DEBUG:LiveCodeEditor:parseLiveCode:');
    // console.log(e);
    addToHistory("lchist_", e);
    if(window.Worker){
      let parserWorkerAsync = new Promise( (res, rej) => {

        parserWorker.postMessage({ // Post code to worker for parsing
          liveCodeSource: e,
          parserSource: $grammarCompiledParser,
          type:'parse'
        });

        parserWorker.onmessage = m => {  // Receive code from worker, pass it to then
          // console.log('DEBUG:LiveCodeEditor:parseLiveCode:onmessage');
          // console.log(m);
          if(m.data !== undefined){
            res(m.data);
          }
        }

      })
      .then(outputs => {
        // console.log('DEBUG:LiveCodeEditor:parseLiveCode:then1');
        // console.log(outputs);
        const { parserOutputs, parserResults } = outputs;
        if( parserOutputs && parserResults ){
          $liveCodeParseResults = parserResults;
          $liveCodeAbstractSyntaxTree = parserOutputs;  //Deep clone created in the worker for AST visualization
          $liveCodeParseErrors = "";
        }
        else {
          // console.log('DEBUG:LiveCodeEditor:parseLiveCode:then2');
          // console.dir(outputs);
          $liveCodeParseErrors = outputs;
          $liveCodeAbstractSyntaxTree = $liveCodeParseResults = '';
        }
      })
      .catch(e => {
        // console.log('DEBUG:parserEditor:parseLiveCode:catch')
        // console.log(e);
        $liveCodeParseErrors = e;
      });
    }
  }

  let parseLiveCodeOnChange = e => {

    let liveCodeEditorValue = null;

    if(e !== undefined && e.detail !== undefined && e.detail.value !== undefined)
      window.localStorage.liveCodeEditorValue = liveCodeEditorValue = e.detail.value;
    else
      liveCodeEditorValue = $liveCodeEditorValue;

    if(liveCodeEditorValue) parseLiveCodeAsync(liveCodeEditorValue);

    // window.localStorage.setItem("parserEditor+ID", editor.getValue());
  }

  let translateILtoDSPasync = e => { // [NOTE:FB] Note the 'async'

    if(window.Worker){

      // let iLWorker = new Worker('../../il.worker.js');
      let iLWorker = new ILWorker();
      let iLWorkerAsync = new Promise( (res, rej) => {

        iLWorker.postMessage({ liveCodeAbstractSyntaxTree: $liveCodeParseResults, type:'ASTtoDSP'});

        let timeout = setTimeout(() => {
            iLWorker.terminate();
            // iLWorker = new Worker('../../il.worker.js');
            // iLWorker = new Worker('./il.worker.js', { type: 'module' });
            iLWorker = new ILWorker();
            // rej('Possible infinite loop detected or worse! Check bugs in ILtoTree.')
        }, 5000);

        iLWorker.onmessage = e => {
          if(e.data !== undefined){
            // console.log('DEBUG:Layout:translateILtoDSP:onmessage')
            // console.log(e);
            // $dspCode = e.data.message;
            res(e.data);
          }
          else if(e.data !== undefined && e.data.length != 0){
            res(e.data);
          }
          clearTimeout(timeout);
        }
      })
      .then(outputs => {
        $dspCode = outputs;
        // evalDSP($dspCode);

        // $liveCodeParseErrors = "";
        console.log('DEBUG:Layout:translateILtoDSPasync');
        console.log($dspCode);
      })
      .catch(e => {
        console.log('DEBUG:Layout:translateILtoDSPasync:catch')
        console.log(e);
      });
    }
  }

  const evalLiveCodeOnEditorCommand = () => {

    try {
      parseLiveCodeAsync(codeMirror.getBlock()); // Code block parsed by parser.worker
      // Parse results are kept in stores for feeding svelte components
      if($grammarCompiledParser && $liveCodeEditorValue && $liveCodeAbstractSyntaxTree){

        // Tree traversal in the main tree. TODO defer to worker thread
        let dspCode = IRToJavascript.treeToCode($liveCodeParseResults);

        // publish eval message with code to audio engine
        messaging.publish("eval-dsp", dspCode);
      }
    } catch (error) {
      console.log('DEBUG:LiveCodeEditor:evalLiveCodeOnEditorCommand:')
      console.log($liveCodeAbstractSyntaxTree);
    }
  }

  const stopAudioOnEditorCommand = () => {
    // publish eval message with code to audio engine
    messaging.publish("stop-audio");
  }

</script>


<style>

  .layout-template-container {
    height: 100vh;
  }

	.scrollable {
		flex: 1 1 auto;
		/* border-top: 1px solid #eee; */
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	}

  .codemirror-container {
    position: relative;
    width: 100%;
    height: 100%;
    border: none;
    line-height: 1.4;
    overflow: hidden;
    font-family: monospace;
    color:white;
  }


  .codemirror-container :global(.CodeMirror) {
    height: 100%;
    background: transparent;
    font: 400 14px/1.7 var(--font-mono);
    color: var(--base);
  }

/*
  .codemirror-container :global(.error-loc) {
    position: relative;
    border-bottom: 2px solid #da106e;
  }

  .codemirror-container :global(.error-line) {
    background-color: rgba(200, 0, 0, 0.05);
  } */


</style>

<div class="codemirror-container layout-template-container scrollable">

 <!-- bind:value={$liveCodeEditorValue} -->
  <CodeMirror bind:this={codeMirror}
              bind:value={value}             
              tab={true}
              lineNumbers={true}
              on:change={parseLiveCodeOnChange}
              ctrlEnter={evalLiveCodeOnEditorCommand}
              cmdEnter={evalLiveCodeOnEditorCommand}
              cmdPeriod={stopAudioOnEditorCommand}
              />
</div>
