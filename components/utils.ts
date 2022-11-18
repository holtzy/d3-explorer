import { matrix, cos, sin } from "mathjs";

// https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
export function buildCirclePath(cx: number, cy: number, r: number) {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,0 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,0 -" +
    r * 2 +
    ",0"
  );
}

// M0,0 150,0 150,50 0,50
export function buildRectPath(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return (
    "M" +
    x +
    "," +
    y +
    " " +
    (x + width) +
    "," +
    y +
    " " +
    (x + width) +
    "," +
    (y + height) +
    " " +
    x +
    "," +
    (y + height) +
    "Z"
  );
}


export function polygon(x:number, y:number, radius:number, npoints:number) {
  let angle = Math.PI*2 / npoints;

  let path = "M"

  for (let a = 0; a < Math.PI*2; a += angle) {
    let sx = x + Math.cos(a) * radius;
    let sy = y + Math.sin(a) * radius;

    path += (sx + "," + sy + " ")

  }

  path += "Z"

  return path
}

export const rotate = (a:number, cx: number, cy: number) => {
  return(
    matrix(
      cos(a),
      sin(a),
      -sin(a),
      cos(a),
      cx(1 - cos(a)) + cy(sin(a)),
      cy(1 - cos(a)) - cx(sin(a))
    )
  )
}
