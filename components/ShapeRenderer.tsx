import { toRect, toCircle, interpolate } from "flubber";
import { animated, useSpring, config, to } from "react-spring";
import { useMemo, useRef } from "react";

type ShapeRendererProps = {
  path: string;
  color: string;
};

export const ShapeRenderer = ({ path, color }: ShapeRendererProps) => {
  // keep track of last used pathD to interpolate from
  const pathRef = useRef("M400,400");
  const colorRef = useRef("transparent");

  // create an interpolator that maps from the current shape (at t=0) to the new provided path (at t=1)
  const pathInterpolator = useMemo(
    () => interpolate(pathRef.current, path),
    [path]
  );

  // create a spring that maps from t = 0 (start animation) to t = 1 (end of animation)
  const springValues = useSpring({
    from: { t: 0, opacity: 0.5, color: colorRef.current },
    to: { t: 1, opacity: 1, color: color },
    // reset t to 0 at the end of the animation, ready for the next one
    reset: true,
    // when t updates, update the last seen D so we can handle interruptions
    onChange: (all) => {
      console.log("all", all);
      pathRef.current = pathInterpolator(all.value.t || 1);
      colorRef.current = all.value.color;
    },
    config: config.molasses,
    // delay: 1000,
  });

  return (
    <animated.path
      d={springValues.t.to((value) => pathInterpolator(value))} // equivalent to d={to(springValues.t, pathInterpolator)}
      opacity={springValues.opacity}
      stroke="transparent"
      fill={springValues.color}
      fillOpacity={0.3}
      strokeWidth={1}
    />
  );
};
