import { toRect, toCircle } from "flubber";
import { animated, useSpring, config, to } from "react-spring";
import * as d3 from "d3";
import { useMemo, useRef } from "react";

type ShapeRendererProps = {
  node: {
    x: number;
    y: number;
    r: number;
  };
  type: "circlepack" | "barplot";
};

export const ShapeRenderer = ({ node, type }: ShapeRendererProps) => {
  // keep track of last used pathD to interpolate from
  const currPAth = useRef();
  const currType = useRef(type);

  // create an interpolator that maps from the current shape (at t=0) to the new provided path (at t=1)
  const pathInterpolator = useMemo(
    () =>
      type === "circlepack"
        ? toCircle(currPAth.current || "M0,0 L0,0Z", node.x, node.y, node.r)
        : toRect(currPAth.current, 10, 10, 200, 200),
    [type]
  );

  // create a spring that maps from t = 0 (start animation) to t = 1 (end of animation)
  const springProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    // reset t to 0 when the path changes so we can begin interpolating anew
    reset: currType.current !== type,
    // when t updates, update the last seen D so we can handle interruptions
    onChange: ({ t }) => {
      currPAth.current = pathInterpolator(t || 1);
      currType.current = type;
    },
    config: config.molasses,
  });

  return (
    <animated.path
      d={to(springProps.t, pathInterpolator)}
      opacity={1}
      stroke="#9a6fb0"
      fill="#9a6fb0"
      fillOpacity={0.3}
      strokeWidth={2}
    />
  );
};
