# ValveKV
TS implementation of Valve Key Value

```ts
const src = `
"eto" {
  "fif" {
    "kafif" "1"
  }
  "fif" {
    "envix" "2"
  }
  "vih" {
    "name" {
      "first" "envix"
      "last" "envix"
    }
    "boolka" "true"
    "size" "4" // eto comment
    // "comments" "support"
    // :smirk_cat:
  }
}
`;

const obj = ValveKV.parse(src);
console.log(obj);

const str = ValveKV.stringify(obj, true);
console.log(str);
```
