import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { select,layout } from "d3";
import * as phylotree from "phylotree"


let data = "((((Pig:0.147969,Cow:0.21343):0.085099,Horse:0.165787,Cat:0.264806):0.058611, ((RhMonkey{Foreground}:0.002015,Baboon{Foreground}:0.003108){Foreground}:0.022733 ,(Human{Foreground}:0.004349,Chimp{Foreground}:0.000799){Foreground}:0.011873):0.101856) :0.340802,Rat:0.050958,Mouse:0.09795)";
export default function PhylotreeView() {
  const svgRef = useRef();
  var tree = phylotree()
  .svg(select("aaaaaa"));

  

tree(data).layout()
  useEffect(() => {
    const svg = select(svgRef.current);
    
      

      
  }, [])
  return (
    <div style={{ marginBottom: "2rem" }} id="aaaaaa">
      {/* <svg ref={svgRef}></svg> */}
    </div>
  )
}
