import { useMemo } from "react";
import * as d3 from "d3";
import { Tree } from "../data/data-types";
import { ShapeRenderer } from "./ShapeRenderer";

type CircularPackingProps = {
  width: number;
  height: number;
  data: Tree;
  type: "circlepack" | "barplot";
};

export const CircularPacking = ({
  width,
  height,
  data,
  type,
}: CircularPackingProps) => {
  // compute shape information for circle pack
  const hierarchy = useMemo(() => {
    return d3
      .hierarchy(data)
      .sum((d) => d.forkCount)
      .sort((a, b) => b.forkCount! - a.forkCount!);
  }, [data]);

  const root = useMemo(() => {
    const packGenerator = d3.pack<Tree>().size([width, height]).padding(4);
    return packGenerator(hierarchy);
  }, [hierarchy, width, height]);

  // compute shape information for bar plot

  // create shapes
  const allShapes = root
    .descendants()
    .slice(1)
    .map((node, i) => (
      <ShapeRenderer key={i} type={type} node={node} />
      // <circle
      //   key={i}
      //   cx={node.x}
      //   cy={node.y}
      //   r={node.r}
      //   stroke="#553C9A"
      //   strokeWidth={2}
      //   fill="#B794F4"
      //   fillOpacity={0.2}
      // />
    ));

  return (
    <svg width={width} height={height}>
      {allShapes}
    </svg>
  );
};
