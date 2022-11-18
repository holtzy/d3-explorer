import { useMemo } from "react";
import * as d3 from "d3";
import { Tree, TreeNode } from "../data/data-types";
import { ShapeRenderer } from "./ShapeRenderer";
import { buildCirclePath, buildRectPath, polygon } from "./utils";
import { cloneDeep } from "lodash";

type CircularPackingProps = {
  width: number;
  height: number;
  data: TreeNode;
  type: "circlepack" | "barplot" | "treemap" | "dendrogram";
};

export const CircularPacking = ({
  width,
  height,
  data,
  type,
}: CircularPackingProps) => {
  const groups = data.children
    .sort((a, b) => b.forkCount - a.forkCount)
    .map((d) => d.name);

  //
  // Circle pack
  //
  const hierarchy = useMemo(() => {
    return d3
      .hierarchy(data)
      .sum((d) => d.forkCount)
      .sort((a, b) => b.forkCount! - a.forkCount!);
  }, [data]);
  const hierarchyClone = cloneDeep(hierarchy);

  const rootCirclePack = useMemo(() => {
    const packGenerator = d3.pack<Tree>().size([width, height]).padding(4);
    return packGenerator(hierarchy);
  }, [hierarchy, width, height]);

  //
  // Treemap
  //
  const rootTreemap = useMemo(() => {
    const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
    return treeGenerator(hierarchy);
  }, [hierarchy, width, height]);

  //
  // Dendrogram
  //
  const rootDendrogram = useMemo(() => {
    const dendroGenerator = d3.tree().size([360, width / 2 - 60]);
    return dendroGenerator(hierarchyClone);
  }, [hierarchyClone, width, height]);

  //
  // Bar plot
  //
  const yScale = useMemo(() => {
    return d3.scaleBand().domain(groups).range([0, height]).padding(0.6);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.children.map((d) => d.forkCount));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, width]);
  }, [data, width]);

  // create shapes
  const allShapes = rootCirclePack
    .descendants()
    .slice(1)
    .filter((node) => node.depth === 1)
    .map((node, i) => {
      const treemapNode = rootTreemap
        .descendants()
        .slice(1)
        .filter((node) => node.depth === 1)
        .filter((n) => n.data.name === node.data.name)[0];

      const dendrogramNode = rootDendrogram
        .descendants()
        .slice(1)
        .filter((node) => node.depth === 1)
        .filter((n) => n.data.name === node.data.name)[0];

      const path =
        type === "circlepack"
          ? polygon(node.x, node.y, node.r, 100)
          : type === "barplot"
          ? buildRectPath(
              xScale(0),
              yScale(node.data.name),
              xScale(node.data.forkCount),
              yScale.bandwidth()
            )
          : type === "dendrogram"
          ? polygon(dendrogramNode.x, dendrogramNode.y, 10, 100)
          : buildRectPath(
              treemapNode.x0,
              treemapNode.y0,
              treemapNode.x1 - treemapNode.x0,
              treemapNode.y1 - treemapNode.y0
            );

      return <ShapeRenderer key={i} path={path} />;
    });

  return (
    <svg width={width} height={height}>
      {allShapes}
    </svg>
  );
};
