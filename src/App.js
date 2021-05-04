import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
  scaleBand,
} from "d3";
import BarChart from "./BarChart";
import GaugeChart from "./chart/gauChart/GaugeChart";
// import ml5 from "ml5";
import useInterval from "./chart/gauChart/useInterval";
import AppSupport from "./Tree/AppSupport";
import AppTree from "./Phylo/AppTree";
import PhylotreeView from "./PhylotreeForder/PhylotreeView";
let classifier;

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75]);
  // const videoRef = useRef();
  // const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
  // const [shouldClassify, setShouldClassify] = useState(false);
  // useEffect(() => {
  //   classifier = ml5.imageClassifier("./my-model/model.json", () => {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: false })
  //       .then(stream => {
  //         videoRef.current.srcObject = stream;
  //         videoRef.current.play();
  //       });
  //   });
  // }, []);
  

  // useInterval(() => {
  //   if (classifier && shouldClassify) {
  //     classifier.classify(videoRef.current, (error, results) => {
  //       if (error) {
  //         console.error(error);
  //         return;
  //       }
  //       results.sort((a, b) => b.label.localeCompare(a.label));
  //       setGaugeData(results.map(entry => entry.confidence));
  //     });
  //   }
  // }, 500);
  return (
    <div>
    {/* <BarChart data={data} setData={setData}/>

      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>

      <button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </button> */}
      {/* <h1>
        Is Muri there? <br />
        <small>
          [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
        </small>
      </h1>
      <GaugeChart data={gaugeData} />
      <button onClick={() => setShouldClassify(!shouldClassify)}>
        {shouldClassify ? "Stop classifying" : "Start classifying"}
      </button>
      <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width="300"
        height="150"
      /> */}
      {/* <Phylotree/> */}
      {/* <AppSupport/> */}
      <AppTree/>
      {/* <PhylotreeView/> */}
    </div>
  );
}

export default App;
