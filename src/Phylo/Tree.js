import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import parseNewick from "./newick.js";
import { BlockPicker, ChromePicker, GithubPicker } from "react-color";
import Tippy from "@tippyjs/react";
import { Newick, NewickJS } from "newick";
import jsonToNewick from "./jsonToNewick.js";
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";
import html2canvas from "html2canvas";
import exportIcon from "../img/export.svg";

export function CountLeafNodes(tree) {
  if (tree.branchset) {
    return tree.branchset
      .map((child) => {
        return CountLeafNodes(child);
      })
      .reduce((a, b) => a + b);
  } else {
    return 1;
  }
}

function maxLength(d) {
  return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
}

function setBrLength(d, y0, k) {
  d.radius = (y0 += Math.max(d.data.length, 0)) * k;
  if (d.children) {
    d.children.forEach(function (d) {
      setBrLength(d, y0, k);
    });
  }
}

function prepareConfig(root, treeheight, storechFn) {
  const data = {};

  const leafdata = [];
  root.leaves().forEach((d) => {
    leafdata.push({ name: d.data.name, x: d.x, y: d.y });
  });
  data["leafloc"] = leafdata;
  data["treeheight"] = treeheight;

  storechFn(data);
}

export default function Tree(props) {
  const {
    tree,
    setTree,
    clickName = () => {},
    getConfig = () => {},
    showBranchLength,
    layout,
    Horizontal,
    circularNumber,
    swap,
    selectNode,
    showBranchLengthNumber,
  } = props;

  const ref = useRef();

  const selectedColor = useRef("#1273dE");
  const setSelectedColor = (color) => {
    selectedColor.current = color.hex;
    var x = document.getElementsByClassName("ref-button");
    for (let i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = color.hex;
    }
  };
  const leafNodes = CountLeafNodes(tree);
  const outerRadius = leafNodes * 3.77 * circularNumber;
  const innerRadius = outerRadius / 4;
  const svgHeight =
    layout === "circular" ? innerRadius * 2  : leafNodes * 20;
  const svgWidth =
    layout === "circular" ? innerRadius * 2  : leafNodes * 30  ; //360 for extra area to vis text

  const height = layout === "circular" ? outerRadius : leafNodes * 20 * 2;
  const width = layout === "circular" ? innerRadius : leafNodes;

  function prune(array, label) {
    for (var i = 0; i < array.length; ++i) {
      var obj = array[i];
      if (obj.id === label) {
        array.splice(i, 1);
        return true;
      }
      if (obj.branchset) {
        if (prune(obj.branchset, label)) {
          if (obj.branchset.length === 0) {
            delete obj.branchset;
            array.splice(i, 1);
          }
          return true;
        }
      }
    }
  }
  function swapNodeChid(array, label) {
    for (var i = 0; i < array.length; ++i) {
      var obj = array[i];
      if (obj.id === label) {
        array[i].branchset.push(obj.branchset[0]);
        array[i].branchset.shift();
        // array.splice(i, 1);
        return true;
      }
      if (obj.branchset) {
        if (swapNodeChid(obj.branchset, label)) {
          if (obj.branchset.length === 0) {
            // array[i].branchset.push(obj.branchset[0])
            // array[i].branchset.shift()
            delete obj.branchset;
            array.splice(i, 1);
          }
          return true;
        }
        return true;
      }
    }
  }
  function swapNodeChidUpdate(d) {
    var target = d.target.__data__.data.id;
    swapNodeChid(tree.branchset, target);
    setTree(tree);
    update(tree);
  }
  function changeColor(array, label) {
    for (var i = 0; i < array.length; ++i) {
      var obj = array[i];
      if (obj.id === label) {
        if (changeColor(obj.branchset, label)) {
          if (obj.branchset.length === 0) {
            array[i].color = selectedColor;
          }
          return true;
        }
      }
      if (obj.branchset) {
        if (changeColor(obj.branchset, label)) {
          if (obj.branchset.length === 0) {
            array[i].color = selectedColor;
          }
          return true;
        }
      }
    }
  }

  function removeNode(d) {
    var target = d.target.__data__.data.id;

    prune(tree.branchset, target);
    setTree(tree);
    update(tree);
  }
  function updateColor(d) {
    var target = d.target.__data__.source.data.id;
    changeColor(tree.branchset, target);
    setTree(tree);

    update(tree);
  }

  function update(tree) {
    const cluster = d3
      .cluster()
      .size([height / 2, width])
      .separation((a, b) => 1);

    const root = d3
      .hierarchy(tree, (d) => d.branchset)
      .sum((d) => (d.branchset ? 0 : 1))
      .sort(
        (a, b) =>
          (a.value - b.value) * swap ||
          d3.ascending(a.data.length, b.data.length)
      );

    cluster(root);
    setBrLength(root, (root.data.length = 0), innerRadius / maxLength(root));

    ref.current.innerHTML = "";
    const svg = d3
      .select(ref.current)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);
    if (layout === "circular") {
      svg.attr(
        "transform",
        `translate(${innerRadius + 180},${innerRadius + 180})`
      );
    }

    const links = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return "#ffff";
      })
      .attr("stroke-width", "1.75")
      .selectAll("path")
      .data(root.links())
      .join("path")
      .on("mouseover", function (d) {
        d3.select(this).style("stroke-width", "5");
      })
      .on("mouseout", function (d) {
        d3.select(this).style("stroke-width", "1.75");
      })
      .on("click", function (d) {
        d3.select(this).style("stroke", selectedColor?.current);
        // console.log(d)
        // updateColor(d)
      })
      .attr("opacity", 1)
      .style("stroke", function (d) {
        return d.source.data.color;
      })
      .attr("d", showBranchLength ? linkVariable : linkConstant);

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", "0.2")
      .selectAll("path")
      .data(
        root.links().filter(function (d) {
          return !d.target.children;
        })
      )
      .enter()
      .append("path")
      .attr("opacity", 1)
      // .each(function (d) {
      //   d.target.linkExtensionNode = this
      // })
      .attr(
        "d",
        showBranchLength ? linkExtensionVariable : linkExtensionConstant
      );
    if (layout === "linear") {
      svg
        .selectAll(".node")
        .data(root.descendants())
        .join("circle")
        .attr("class", "node")
        .attr("r", 4)
        .attr("fill", "black")
        .attr("cx", (d) =>
          showBranchLength ? d.radius * 5 * Horizontal : d.y * 5 * Horizontal
        )
        .attr("cy", (d) => d.x)
        .on("mouseover", function (d) {
          d3.select(this).attr("r", 7);
        })
        .on("mouseout", function (d) {
          d3.select(this).attr("r", 4);
        })
        .on("click", function (d) {
          switch (selectNode) {
            case "delete":
              removeNode(d);
              break;
            case "swap":
              swapNodeChidUpdate(d);
              break;
            default:
            // code block
          }

          // console.log(d.target.__data__.data.id)
          // d3.select(this).attr("pointer-events", "none");
        })
        .attr("opacity", 0)
        .attr("opacity", 1);
      if (showBranchLengthNumber === true) {
        svg
          .append("g")
          .selectAll("text2")
          .data(root.descendants())
          .join("text")
          .attr("x", (d) =>
            showBranchLength
              ? d.radius * 5 * Horizontal - 50
              : d.y * 5 * Horizontal - 50
          )
          .attr("y", (d) => d.x - 4)
          .text((d) => (String(d.data.length) || "").replace(/_/g, " "))
          .on("click", (d) => {
            console.log(d);
          });
      }

      svg
        .append("g")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", (d) => d.y * 5 * Horizontal + 5)
        .attr("y", (d) => d.x + 4)
        .text((d) => (d.data.name || "").replace(/_/g, " "))
        .on("mouseover", mouseovered(true))
        .on("mouseout", mouseovered(false))
        .on("click", (d) => {
          console.log(d);
        });
    } else if (layout === "circular") {
      svg
        .append("g")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("dy", ".31em")
        .attr(
          "transform",
          (d) =>
            `rotate(${d.x - 90}) translate(${
              innerRadius * Horizontal + 4 * Horizontal
            },0)${d.x < 180 ? "" : " rotate(180)"}`
        )
        .attr("text-anchor", (d) => (d.x < 180 ? "start" : "end"))
        .text((d) => (d.data.name || "").replace(/_/g, " "))
        .on("mouseover", mouseovered(true))
        .on("mouseout", mouseovered(false))
        .on("click", (d) => {
          clickName(d);
        });
    }

    function linkVariable(d) {
      return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
    }

    function linkConstant(d) {
      return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
    }
    function linkExtensionVariable(d) {
      return linkStep(d.target.x, d.target.radius, d.target.x, d.target.y);
    }

    function linkExtensionConstant(d) {
      return linkStep(d.target.x, d.target.y, d.target.x, d.target.y);
    }

    function linkStep(sx, sy, tx, ty) {
      if (layout === "linear") {
        return `M${sy * 5 * Horizontal} ${sx}V${tx}H${ty * 5 * Horizontal}`;
      } else if (layout === "circular") {
        const c0 = Math.cos((sx = ((sx - 90) / 180) * Math.PI));
        const s0 = Math.sin(sx);
        const c1 = Math.cos((tx = ((tx - 90) / 180) * Math.PI));
        const s1 = Math.sin(tx);
        return `M
          ${sy * c0 * Horizontal}
          ,
          ${sy * s0 * Horizontal}
          ${
            tx === sx
              ? ""
              : `A
              ${sy}
              ,
              ${sy}
               0 0
              ${tx > sx ? 1 : 0}
              ${sy * c1 * Horizontal}
              ,
              ${sy * s1 * Horizontal}`
          }
          L
          ${ty * c1 * Horizontal}
          ,
          ${ty * s1 * Horizontal}`;
      }
    }

    function mouseovered(active) {
      return function (d) {
        d3.select(this).classed("label--active", active);
      };
    }
    prepareConfig(root, leafNodes * 20, getConfig);
  }

  useEffect(() => {
    update(tree);
  }, [
    clickName,
    getConfig,
    showBranchLength,
    width,
    leafNodes,
    tree,
    layout,
    height,
    innerRadius,
    circularNumber,
    swap,
    selectNode,
    showBranchLengthNumber,
  ]);
  function dowloadImage(params) {
    // var canvas = document.getElementById("svg-chart");
    // var img    = canvas.toDataURL("image/png");
    // document.write('<img src="'+img+'"/>');
  }
  function exportNewick(params) {
    // var serializedTree = exportNewick.serialize(tree)
    var serializedTree = jsonToNewick(tree);
  }
  const download = () => {
    html2canvas(document.querySelector("#widget")).then((canvas) => {
      document.body.appendChild(canvas);
    });
  };
  const ComponentToPrint = React.forwardRef((props, ref2) => (
    <div
      ref={ref2}
      style={{
        width: svgWidth,
        height: svgHeight,
        display: "flex",
        flexDirection: "row",
        marginTop: "4em",
        marginLeft: "5em",
      }}
      id="widget"
    >
      <svg width={svgWidth} height={svgHeight} id="svg-chart">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .link--active {
                stroke: #000 !important;
                stroke-width: 1.5px;
            }
            .label--active {
                font-weight: bold;
            }`,
          }}
        />
        <g ref={ref}></g>
      </svg>
    </div>
  ));
  const componentRef = useRef();

  return (
    <div>
      <Tippy
        interactive={true}
        content={
          <GithubPicker
            color={selectedColor?.curent}
            onChangeComplete={(color) => setSelectedColor(color)}
          />
        }
      >
        <div
          className="ref-button btn btn-primary"
          style={{ backgroundColor: "#1273DE" }}
          style={{
            position: "absolute",
            top: "1em",
            outline: "hidden",
            left: "3.5em",
          }}
        >
          Color Branch
        </div>
      </Tippy>

      <button
        onClick={exportNewick}
        title="export newick"
        data-toggle="modal"
        data-target="#myModal"
        style={{
          position: "absolute",
          top: "1em",
          outline: "hidden",
          left: "20em",
        }}
        className="btn btn-light "
      >
        Export
      </button>

      <div>
        <ComponentToPrint ref={componentRef} />
      </div>

      <button
        onClick={() => exportComponentAsJPEG(componentRef)}
        className="btn btn-light"
        style={{
          position: "absolute",
          top: "1em",
          outline: "hidden",
          left: "28em",
        }}
      >
        Export JPEG
      </button>

      <button
        onClick={() => exportComponentAsPNG(componentRef)}
        className="btn btn-light"
        style={{
          position: "absolute",
          top: "1em",
          outline: "hidden",
          left: "36em",
        }}
      >
        Export PNG
      </button>

      <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Export Newick</h4>
            </div>
            <div class="modal-body">
              <p>{jsonToNewick(tree)}</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Tree.propTypes = {
  data: PropTypes.string,
  clickName: PropTypes.func,
  getChildLoc: PropTypes.func,
  ChangebranchLengthID: PropTypes.string,
  layout: PropTypes.string,
};

Tree.defaultProps = {
  data: "",
  clickName: null,
  getChildLoc: null,
  ChangebranchLengthID: "notpossible",
  layout: "linear",
};
