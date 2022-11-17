import { useMemo } from "react";
import * as d3 from "d3";
import { Tree } from "../data/data-types";

type CircularPackingProps = {
  width: number;
  height: number;
  data: Tree;
};

export const CircularPacking = ({
  width,
  height,
  data,
}: CircularPackingProps) => {
  console.log("data", data);

  const hierarchy = useMemo(() => {
    return d3
      .hierarchy(data)
      .sum((d) => d.stargazerCount)
      .sort((a, b) => b.stargazerCount! - a.stargazerCount!);
  }, [data]);
  console.log(hierarchy);
  const root = useMemo(() => {
    const packGenerator = d3.pack<Tree>().size([width, height]).padding(4);
    return packGenerator(hierarchy);
  }, [hierarchy, width, height]);

  return (
    <svg width={width} height={height}>
      {root
        .descendants()
        .slice(1)
        .map((node) => (
          <circle
            key={node.data.name}
            cx={node.x}
            cy={node.y}
            r={node.r}
            stroke="#553C9A"
            strokeWidth={2}
            fill="#B794F4"
            fillOpacity={0.2}
          />
        ))}
      {root
        .descendants()
        .slice(1)
        .map((node) => (
          <text
            key={node.data.name}
            x={node.x}
            y={node.y}
            fontSize={13}
            fontWeight={0.4}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {node.data.name}
          </text>
        ))}
    </svg>
  );
};
