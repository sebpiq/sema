<script>
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper";
  import map from "lodash.map";
  import Editor from '../editors/Editor.svelte';
  import ModelEditor from '../editors/ModelEditor.svelte';
  import GrammarEditor from '../editors/GrammarEditor.svelte';
  import LiveCodeEditor from '../editors/LiveCodeEditor.svelte';
  import LiveCodeParseOutput from '../widgets/LiveCodeParseOutput.svelte';
  import GrammarCompileOutput from '../widgets/GrammarCompileOutput.svelte';
  import { PubSub } from "../../messaging/pubSub.js"; 
 
  import {
    dashboardItems,
    selectedItem,
    selectedItemControls,
    grammarEditorValue,
    modelEditorValue,
    liveCodeEditorValue
  } from "../../store.js"
 
  const messaging = new PubSub();

  export let value = '';

  var cols = 15;

  let breakpoints = [[1000, 10], [700, 5], [500, 3], [400, 1]];

  const id = () =>
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9);

  const types = ['live', 'model', 'grammar', 'liveCodeParseOutput', 'grammarCompileOutput' ];
  const itype = () => types[Math.floor(Math.random() * types.length)];

  const random = (min, max) => Math.random() * (max - min) + min;

  const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  const themes = ['monokai', 'cobalt', 'icecoder', 'shadowfox' ];
  const itheme = () => types[Math.floor(Math.random() * themes.length)];

  function generateLayout(col) {
    return map(new Array(5), function(item, i) {
      const x = Math.ceil(Math.random() * 3) + 2;
      const y = Math.ceil(Math.random() * 4) + 1;
      const iid = id();
      return {
        ...gridHelp.item({
          x: (i * 2) % col,
          y: Math.floor(i / 6) * y,
          w: x,
          h: y,
          id: iid,
          name: iid,
          type: itype()
        }),
        ...{ data: randomHexColorCode() },
      };
    });
  }

  let layoutOriginal = [
    gridHelp.item({ x: 0, y: 0, w: 7, h: 3, id: id(), name:'default', type:'live', lineNumbers: true, hasFocus: false, theme: "monokai",  data: '#151515', value: $liveCodeEditorValue  }), 
    gridHelp.item({ x: 7, y: 0, w: 3, h: 7, id: id(), name:'hello world', type:'liveCodeParseOutput', lineNumbers: false, hasFocus: false, theme: "shadowfox", data: '#ebdeff' }),
    gridHelp.item({ x: 10, y: 0, w: 8, h: 2, id: id(), name:'hello world', type:'grammarCompileOutput', lineNumbers: true, hasFocus: false, theme: "monokai", data: '#d1d5ff' }),
    gridHelp.item({ x: 10, y: 2, w: 5, h: 5, id: id(), name:'default', type:'grammar', lineNumbers: false, hasFocus: false, theme: "cobalt", data: '#AAAAAA', value: $grammarEditorValue }),
    gridHelp.item({ x: 0, y: 4, w: 7, h: 4, id: id(), name:'hello world', type:'model', lineNumbers: true, hasFocus: false, theme: "icecoder", data: '#f0f0f0', value: $modelEditorValue })
  ];
  
  let layout;

  let items = [];

  // items = generateLayout(cols);
  $dashboardItems = gridHelp.resizeItems(items, cols);

  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem("layout")) {
      window.localStorage.setItem("layout", JSON.stringify(layoutOriginal));
      items = layoutOriginal; 
    } else {
      items = JSON.parse(window.localStorage.getItem("layout"));
    }
  }
  
  // let items = layout;
  // console.log('DEBUG:Dashboard:items:');
  // console.log(items);


  const onAdjust = () => {
    window.localStorage.setItem("layout", JSON.stringify(items));
  };
  
  const reset = () => {
    items = layoutOriginal;
    window.localStorage.setItem("layout", JSON.stringify(layoutOriginal));
  };

  export const addItem = (itemType, itemId, itemValue) => {
    const i = 2;
    const col = 2;
    const x = Math.ceil(Math.random() * 3) + 2;
    const y = Math.ceil(Math.random() * 4) + 1;
    const iid = id();
    // items = [
    //   ...items, 
    //   { ...gridHelp.item({
    //           x: (i * 2) % col,
    //           y: Math.floor(i / 6) * y,
    //           w: x,
    //           h: y,
    //           id: iid,
    //           name: iid,
    //           type: itemType,
    //           lineNumbers: true,
    //           hasFocus: false,
    //           theme: 'monokai',
    //           value: itemValue
    //         }),
    //     ...{ data: randomHexColorCode() }
    //   }
    // ]

    let newItem = { ...gridHelp.item({
              x: (i * 2) % col,
              y: Math.floor(i / 6) * y,
              w: x,
              h: y,
              id: iid,
              name: iid,
              type: itemType,
              lineNumbers: true,
              hasFocus: false,
              theme: 'monokai',
              value: itemValue
            }),
        ...{ data: randomHexColorCode() }
      };
    items = gridHelp.appendItem(newItem, items, cols);
    window.localStorage.setItem("layout", JSON.stringify(items)); 
    // $dashboardItems = gridHelp.resizeItems(items, cols);
  }


  function remove(item, event) {
    // console.log("DEBUG:Dashboard:remove:")
    // console.log(item);
    // console.log(event);

    items = items.filter(value => value.id !== item.id);
    window.localStorage.setItem("layout", JSON.stringify(items));
    $dashboardItems = gridHelp.resizeItems(items, cols);
    // if (adjustAfterRemove) {
    //   items = gridHelp.resizeItems(items, cols);
    // }
  }


	const update = (item, prop, value) => {
		// either this...
		item[prop] = value;
		items = items; // force an update
		// ...or this:
		// items = items.map(i => i === item ? { ...i, [prop]: value } : i);
	 }

</script>


<style>
  /* .layout-template-container {
    height: 100vh;
  } */


  .layout-template-container {
    /* height: 100vh; */
    	height: 100%;
      /* overflow: hidden; */
  }

  .content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border-top-left-radius: 0px;
    border-bottom-right-radius: 3px;
    
  }

  :global(*) {
    user-select: none;
  }

  :global(body) {
    overflow: scroll;
    margin: 0;
  }

  :global(.svlt-grid-resizer) {
    z-index: 1500;
  }

  :global(.svlt-grid-resizer::after) {
    border-color: white !important;
  }

  :global(.svlt-grid-transition > .svlt-grid-item) {
    transition: transform 0.2s;
  }

  :global(.svlt-grid-shadow) {
    background: pink;
    border-radius: 6px;
    border-bottom-right-radius: 3px;
    /*transition: top 0.2s, left 0.2s;*/
    transition: transform 0.2s;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 10px;
    cursor: pointer;
    z-index: 1500;
  }

  .move {
    font-size: 1.2em; 
    position: absolute;
    padding: 1px 5px;
    cursor: move;
    z-index: 1500;
    color: lightgray;
  }

 	/* .scrollable {
		flex: 1 1 auto;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	} */

</style>

<div class="layout-template-container">
  <Grid {$dashboardItems}
        useTransform {breakpoints} 
        rowHeight={100} 
        gap={1} 
        bind:items {cols} 
        let:item      
        on:adjust={onAdjust}>
    <span class='move'>+</span>
    <div class="content" style="background: { item.static ? '#ccccee' : item.data}" on:mousedown={ e => e.stopPropagation() } >
      <span on:click={ remove.bind(null, item) } class='close'>✕</span>
        {#if item.type === 'model' }
        <!-- <ModelEditor bind:value={value} /> -->
        <ModelEditor value={item.value} />

        {:else if item.type === 'grammar' }
        <GrammarEditor value={item.value} />
        
        {:else if item.type === 'live' }
        <LiveCodeEditor value={item.value} />
       
        {:else if item.type === 'liveCodeParseOutput' }
        <LiveCodeParseOutput class='scrollable'/>
       
        {:else if item.type === 'grammarCompileOutput' }
        <GrammarCompileOutput class='scrollable'/>
       
        {:else}
        <Editor bind:value={value}/>
        {/if}
    </div>
  </Grid>
</div>
