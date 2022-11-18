import { useMemo } from "react";
import * as d3 from "d3";
import { Tree, TreeNode } from "../data/data-types";
import { ShapeRenderer } from "./ShapeRenderer";

type CircularPackingProps = {
  width: number;
  height: number;
  data: TreeNode;
  type: "circlepack" | "barplot" | "treemap";
};

export const CircularPacking = ({
  width,
  height,
  data,
  type,
}: CircularPackingProps) => {
  //
  // Circle pack
  //
  const hierarchy = useMemo(() => {
    return d3
      .hierarchy(data)
      .sum((d) => d.forkCount)
      .sort((a, b) => b.forkCount! - a.forkCount!);
  }, [data]);

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
  // Bar plot
  //
  const groups = data.children
    .sort((a, b) => b.forkCount - a.forkCount)
    .map((d) => d.name);

  const yScale = useMemo(() => {
    return d3.scaleBand().domain(groups).range([0, height]).padding(0.2);
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
      return (
        <ShapeRenderer
          key={i}
          type={type}
          circle={{ x: node.x, y: node.y, r: node.r }}
          rectBarplot={{
            x: xScale(0),
            y: yScale(node.data.name),
            width: xScale(node.data.forkCount),
            height: yScale.bandwidth(),
          }}
          index={i}
        />
      );
    });

  return (
    <svg width={width} height={height}>
      {allShapes}
    </svg>
  );
};
