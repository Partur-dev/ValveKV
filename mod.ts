/**
 * TS implementation of Valve Key Value
 * For kafif
 */
export class ValveKV {
  static parse = (code: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    let current = result;
    let isString = false;
    let isKey = true;
    let tmp = '';
    let comment = 0;

    for (const char of code.split('')) {
      if (char == '/') {
        comment = comment == 0 ? 1 : 2;
      }

      if (comment == 2) {
        if (char == '\n') {
          comment = 0;
        }

        continue;
      }

      if (char == '"') {
        if (isString) {
          isString = false;

          if (isKey) {
            current[tmp] = undefined;
            isKey = false;
          } else {
            current[Object.keys(current).at(-1)!] = tmp;
            isKey = true;
          }

          tmp = '';
        } else {
          isString = true;
        }

        continue;
      }

      if (char == '{') {
        isKey = true;
        const newCurrent = {};
        current[Object.keys(current).at(-1)!] = newCurrent;
        current = newCurrent;
      }

      if (isString) {
        tmp += char;
      }
    }

    return result;
  };

  static stringify(obj: Record<string, unknown>, tabLevel = 0): string {
    let result = '';
    const tabs = '\t'.repeat(tabLevel);

    for (const [key, value] of Object.entries(obj)) {
      result += `${tabs}"${key}" `;
      if (typeof value === 'string') {
        result += `"${value}"\n`;
      } else {
        result += '{\n';
        result += this.stringify(
          value as Record<string, unknown>,
          tabLevel + 1,
        );
        result += `${tabs}}\n`;
      }
    }

    return result;
  }
}
