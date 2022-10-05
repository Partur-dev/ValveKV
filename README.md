# ValveKV
TS implementation of Valve Key Value

```ts
const src = `
  "eto" {
    "fif" "kafif"
    "envix" {
      "eto" "envix" // энвіх"
      "vih" "da"
      // "pimon" "fifmon"
    } 
  }
`;

const obj = ValveKV.parse(src);
console.log(obj);

const str = ValveKV.stringify(obj);
console.log(str);
```
