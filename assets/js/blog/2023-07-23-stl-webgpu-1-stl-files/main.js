const stl = await fetch(
  "https://upload.wikimedia.org/wikipedia/commons/9/93/Utah_teapot_%28solid%29.stl?download"
).then((r) => r.arrayBuffer());

const dv = new DataView(stl.slice(80));
const triangleCount = dv.getUint32(0, true);

const triangles = [];
for (let i = 0; i < triangleCount; i++) {
  // 2 bytes triangle count + 50 bytes per triangle
  // prettier-ignore
  const triangleOffset = (50 * i) + 4;
  // prettier-ignore
  const triangle = [
    {
      x: dv.getFloat32(triangleOffset + (3 * 4), true),
      y: dv.getFloat32(triangleOffset + (4 * 4), true),
      z: dv.getFloat32(triangleOffset + (5 * 4), true),
    },
    {
      x: dv.getFloat32(triangleOffset + (6 * 4), true),
      y: dv.getFloat32(triangleOffset + (7 * 4), true),
      z: dv.getFloat32(triangleOffset + (8 * 4), true),
    },
    {
      x: dv.getFloat32(triangleOffset + (9 * 4), true),
      y: dv.getFloat32(triangleOffset + (10 * 4), true),
      z: dv.getFloat32(triangleOffset + (11 * 4), true),
    },
  ];
  triangles.push(triangle);
}

const canvas = document.querySelector("#js-stl-render-output");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

const flattenedTriangles = triangles.flat();
const minX = Math.min(...flattenedTriangles.map((p) => p.x));
const maxX = Math.max(...flattenedTriangles.map((p) => p.x));
const minY = Math.min(...flattenedTriangles.map((p) => p.y));
const maxY = Math.max(...flattenedTriangles.map((p) => p.y));
const maxScaleX = canvas.width / (maxX - minX);
const maxScaleY = canvas.height / (maxY - minY);
const scale = Math.min(maxScaleX, maxScaleY);

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
// prettier-ignore
const shift = {
  x: center.x - (((maxX + minX) / 2) * scale),
  y: center.y - (((maxY + minY) / 2) * scale),
};

triangles.sort(
  (a, b) => Math.min(...a.map((p) => p.z)) - Math.min(...b.map((p) => p.z))
);

ctx.strokeStyle = "#fff";
ctx.fillStyle = "#aaa";
for (const triangle of triangles) {
  // Here would be lighting

  // const u = {
  //   x: triangle[1].x - triangle[0].x,
  //   y: triangle[1].y - triangle[0].y,
  //   z: triangle[1].z - triangle[0].z,
  // };

  // const v = {
  //   x: triangle[2].x - triangle[0].x,
  //   y: triangle[2].y - triangle[0].y,
  //   z: triangle[2].z - triangle[0].z,
  // };

  // const normal = {
  //   x: u.y * v.z - u.z * v.y,
  //   y: u.z * v.x - u.x * v.z,
  //   z: u.x * v.y - u.y * v.x,
  // };

  // const light = {
  //   x: 1,
  //   y: -1,
  //   z: 1,
  // };

  // const normalLength = Math.sqrt(
  //   normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
  // );

  // const lightLength = Math.sqrt(
  //   light.x * light.x + light.y * light.y + light.z * light.z
  // );

  // const dot = normal.x * light.x + normal.y * light.y + normal.z * light.z;

  // const angle = Math.acos(dot / (normalLength * lightLength));

  // const brightness = 1 - Math.max(0, Math.min(1, angle / Math.PI));

  // ctx.fillStyle = `rgb(${brightness * 255}, ${brightness * 255}, ${
  //   brightness * 255
  // })`;
  // ctx.strokeStyle = `rgb(${brightness * 255}, ${brightness * 255}, ${
  //   brightness * 255
  // })`;

  ctx.beginPath();
  // prettier-ignore
  ctx.moveTo(shift.x + (triangle[0].x * scale), shift.y + (triangle[0].y * scale));
  // prettier-ignore
  ctx.lineTo(shift.x + (triangle[1].x * scale), shift.y + (triangle[1].y * scale));
  // prettier-ignore
  ctx.lineTo(shift.x + (triangle[2].x * scale), shift.y + (triangle[2].y * scale));
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}
