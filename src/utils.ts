export function generate(len = 5) {
  const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += subset[Math.floor(Math.random() * subset.length)];
  }
  return id;
}
