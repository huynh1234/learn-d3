import React, { useEffect, useRef, useState } from "react";
import Tree from "./Tree";
import TreeCircular from "./TreeCircular";
import imgIcon from "../img/search.svg";
import treeIcon from "../img/icon.svg";
import noBranchIcon from "../img/noBranch.svg";
import horizontalInIcon from "../img/horizontalIn.svg";
import plusIcon from "../img/plus.svg";
import minusIcon from "../img/minus.svg";

import treeShowBranchlengthIcon from "../img/branchLength.svg";

import hiddenLeaveIcon from "../img/hidden.svg";
import swapIcon from "../img/arrows.svg";
import horizontalOutIcon from "../img/arrow2.svg";
import cricleIcon from "../img/cricle.svg";
import parseNewick from "./newick.js";

const data2 =
  "(((EELA:0.150276,CONGERA:0.213019):0.230956,(EELB:0.263487,CONGERB:0.202633):0.246917):0.094785,((CAVEFISH:0.451027,(GOLDFISH:0.340495,ZEBRAFISH:0.390163):0.220565):0.067778,((((((NSAM:0.008113,NARG:0.014065):0.052991,SPUN:0.061003,(SMIC:0.027806,SDIA:0.015298,SXAN:0.046873):0.046977):0.009822,(NAUR:0.081298,(SSPI:0.023876,STIE:0.013652):0.058179):0.091775):0.073346,(MVIO:0.012271,MBER:0.039798):0.178835):0.147992,((BFNKILLIFISH:0.317455,(ONIL:0.029217,XCAU:0.084388):0.201166):0.055908,THORNYHEAD:0.252481):0.061905):0.157214,LAMPFISH:0.717196,((SCABBARDA:0.189684,SCABBARDB:0.362015):0.282263,((VIPERFISH:0.318217,BLACKDRAGON:0.109912):0.123642,LOOSEJAW:0.397100):0.287152):0.140663):0.206729):0.222485,(COELACANTH:0.558103,((CLAWEDFROG:0.441842,SALAMANDER:0.299607):0.135307,((CHAMELEON:0.771665,((PIGEON:0.150909,CHICKEN:0.172733):0.082163,ZEBRAFINCH:0.099172):0.272338):0.014055,((BOVINE:0.167569,DOLPHIN:0.157450):0.104783,ELEPHANT:0.166557):0.367205):0.050892):0.114731):0.295021)myroot";
const data3 =
  "(LngfishAu:0.1712920518,(LngfishSA:0.1886950015,LngfishAf:0.1650939272):0.1074934723,(Frog:0.2567782559,((((Turtle:0.2218655584,(Crocodile:0.3063185169,Bird:0.2314909181):0.0651737381):0.0365470299,Sphenodon:0.3453327943):0.0204990607,Lizard:0.3867277545):0.0740995375,(((Human:0.1853482056,(Seal:0.0945218205,(Cow:0.0823893414,Whale:0.1013456886):0.0404741864):0.0252648881):0.0341157851,(Mouse:0.0584468890,Rat:0.0906222037):0.1219452651):0.0608099176,(Platypus:0.1922418336,Opossum:0.1511451490):0.0373121980):0.1493323365):0.1276903176):0.0942232386);";
export default function AppTree() {
  const [value, setValue] = useState(true);
  const [inputData, setInputData] = useState("");

  const [horizontal, setHorizontal] = useState(1.1);
  const [swap, setSwap] = useState(1);
  const [showBranchLengthNumber, setShowBranchLengthNumber] = useState(true);
  const [tree, setTree] = useState(parseNewick(data2));
  
  const [layout, setLayout] = useState("linear");

  const [circularNumber, setCircularNumber] = useState(1);
  let fname = "";
  const setfName = (text) => {
    fname = text;
  };
  const changeLayout = () => {
    if (layout === "linear") {
      setLayout("circular");
    } else {
      setLayout("linear");
      setCircularNumber(1);
    }
  };
  const hiddenLeaves = () => {
    var x = document.querySelectorAll("text");
    for (let i = 0; i < x.length; i++) {
      x[i].remove();
    }
  };

  const search = (txt) => {
    var x = document.querySelectorAll("text");
    if(txt !==""){
      for (let i = 0; i < x.length; i++) {
        if (x[i].textContent.includes(txt) ) {
          x[i].style.fill = "red";
          x[i].style.fontWeight = "bold";
        } else {
          x[i].style.fill = "#000";
          x[i].style.fontWeight = "100";
        }
      }
    }else {
      for (let i = 0; i < x.length; i++) {
          x[i].style.fill = "#000";
          x[i].style.fontWeight = ""; 
      }  
    }
    
    console.log(selectedFile);
  };
  const [selectedFile, setSelectedFile] = useState(data2);
  let fileReader;
 
  const handleFileRead = (e) => {
    const content = fileReader.result;
    setTree(parseNewick(content));
    // setSelectedFile(content)
    // … do something with the 'content' …
  };
  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  const createTree=(parse)=>{
    if(parse?.branchset?.length!==0 && parse?.id &&parse?.color){
      setTree(parse)
    }else{
       alert("ERROR Input")
    }
  }
 
  return (
    <div
      style={{
        display: "flex",
        height: 500,
        flexDirection: "column",
        width: "100%",
        marginTop:"4em"
      }}
    >
      <div className="btn-bar">
        <div className="btn-left-bar">
          <div>
            <input
              type="file"
              id="file"
              className="input-file"
              accept=".csv"
              onChange={(e) => handleFileChosen(e.target.files[0])}
            />
          </div>
          <button
            onClick={() => setShowBranchLengthNumber(!showBranchLengthNumber)}
            title="BranchNumber"
          >
            <img src={treeShowBranchlengthIcon} alt="" />
          </button>

          <button onClick={() => setValue(!value)} title="No Branch Length">
            <img src={noBranchIcon} alt="" />
          </button>

          <button onClick={() => hiddenLeaves()} title="hiddenLeaves">
            <img src={hiddenLeaveIcon} alt="" />
          </button>

          <button
            onClick={() => setHorizontal(horizontal + 0.1)}
            title="horizontal Out"
          >
            <img src={horizontalOutIcon} alt="" />
          </button>
          <button
            onClick={() => setHorizontal(horizontal - 0.1)}
            title="horizontal In"
          >
            <img src={horizontalInIcon} alt="" />
          </button>

          <button onClick={() => setSwap(swap * -1)} title="swap">
            <img src={swapIcon} alt="" />
          </button>

          <button
            onClick={() => changeLayout()}
            title={layout === "linear" ? "linear" : "circular"}
          >
            {layout === "linear" ? (
              <img src={cricleIcon} alt="" />
            ) : (
              <img src={treeIcon} alt="" />
            )}
          </button>

          {layout === "circular" ? (
            <button
              onClick={() => setCircularNumber(circularNumber + 0.5)}
              title="fix cricle"
            >
              <img src={plusIcon} alt="" />
            </button>
          ) : null}
          {layout === "circular" ? (
            <button
              onClick={() => setCircularNumber(circularNumber - 0.5)}
              title="fix cricle"
            >
              <img src={minusIcon} alt="" />
            </button>
          ) : null}
        </div>
        <div>
          <div className="search-leaves">
            <input
              type="text"
              placeholder="search"
              onChange={(e) => setfName(e.target.value)}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  search(event.target.value)
                }
              }}
            />
            <button onClick={() => search(fname)} className="btn-search">
              <img src={imgIcon} alt="" />
            </button>
          </div>
        </div>




        
      </div>
            <Tree
              data={selectedFile }
              tree={tree}
              setTree={setTree}
              clickName={(d) => {
                console.log(d);
              }}
              getConfig={(d) => {
                console.log(d.leafloc);
              }}
              layout={layout}
              showBranchLengthNumber={showBranchLengthNumber}
              selectNode="delete"
              showBranchLength={value}
              Horizontal={horizontal}
              circularNumber={circularNumber}
              swap={swap}
            /> 
            
      

<button
          title="export newick"
          data-toggle="modal"
          data-target="#myModal2"
          style={{position: "absolute", top: "1em", outline:"hidden" ,left:"12em"}}
          className="btn btn-light "
        >
          Input
        </button>


    <div class="modal fade" id="myModal2" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Input Newick</h4>
            </div>
            <div class="modal-body">
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                  style={{width:"100%",height:400}}
                  type="text"
                  placeholder="Input Newick"
                  onChange={(e) => setInputData(e.target.value)}
                />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                onClick={()=>createTree(parseNewick(inputData))}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
