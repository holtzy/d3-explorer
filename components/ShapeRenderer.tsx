import { toRect, toCircle, interpolate } from "flubber";
import { animated, useSpring, config, to } from "react-spring";
import { useMemo, useRef } from "react";

type ShapeRendererProps = {
  path: string;
};

export const ShapeRenderer = ({ path }: ShapeRendererProps) => {
  // keep track of last used pathD to interpolate from
  const currD = useRef(path);

  // create an interpolator that maps from the current shape (at t=0) to the new provided path (at t=1)
  const pathInterpolator = useMemo(
    () => interpolate(currD.current, path),
    [path]
  );

  // create a spring that maps from t = 0 (start animation) to t = 1 (end of animation)
  const springProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    // reset t to 0 when the path changes so we can begin interpolating anew
    reset: currD.current !== path,
    // when t updates, update the last seen D so we can handle interruptions
    onChange: ({ t }) => {
      currD.current = pathInterpolator(t || 1);
    },
    config: config.molasses,
    // delay: 1000,
  });

  return (
    <animated.path
      d={to(springProps.t, pathInterpolator)}
      opacity={1}
      stroke="#9a6fb0"
      fill="#9a6fb0"
      fillOpacity={0.3}
      strokeWidth={1}
    />
  );
};
