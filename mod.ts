type AnyObject = Record<string, unknown>;

enum TokenType {
  BlockStart,
  BlockEnd,
  String,
}

interface Token {
  type: TokenType;
  data?: string;
}

class Tokenizer {
  private _code: string;
  private _position: number;

  public constructor(code: string) {
    this._code = code;
    this._position = 0;
  }

  public nextToken(): Token {
    while (true) {
      this._ignoreWhitespace();
      if (!this._ignoreComment()) {
        break;
      }
    }

    const current = this._current();

    if (current === '{') {
      this._move();
      return { type: TokenType.BlockStart };
    } else if (current === '}') {
      this._move();
      return { type: TokenType.BlockEnd };
    } else {
      const data = this._getString();
      return { type: TokenType.String, data };
    }
  }

  private _getString(): string {
    let result = '';
    let quoted = false;

    if (this._current() === '"') {
      quoted = true;
      this._move();
    }

    while (true) {
      if (!quoted && ['{', '}'].includes(this._current())) {
        break;
      }

      if (quoted && this._current() === '"') {
        break;
      }

      result += this._current();

      this._move();
    }

    if (quoted) {
      this._move();
    }

    return result;
  }

  private _ignoreWhitespace(): void {
    // console.log('----\n', this._code.slice(this._position));

    while (['\t', '\n', ' '].includes(this._current())) {
      this._move();
    }
  }

  private _ignoreComment(): boolean {
    if (this._current() === '/' && this._next() === '/') {
      while (this._current() !== '\n') {
        this._move();
      }
      return true;
    }
    return false;
  }

  private _current(): string {
    if (this._position >= this._code.length) {
      throw new Error('position > code.length');
    }

    return this._code.at(this._position)!;
  }

  private _next(): string {
    if (this._position + 1 >= this._code.length) {
      throw new Error('position + 1 > code.length');
    }

    return this._code.at(this._position)!;
  }

  private _move() {
    if (this._position + 1 >= this._code.length) {
      throw new Error('position + 1 > code.length');
    }

    this._position += 1;
  }
}

const _parse = (tokenizer: Tokenizer): AnyObject => {
  const result: AnyObject = {};
  let key: string | undefined = undefined;

  while (true) {
    const token = tokenizer.nextToken();

    if (typeof key !== 'undefined') {
      if (token.type === TokenType.BlockStart) {
        const value = _parse(tokenizer);
        if (typeof result[key] === 'object') {
          result[key] = { ...result[key] as AnyObject, ...value };
        } else {
          result[key] = value;
        }
      } else if (token.type === TokenType.String) {
        result[key] = token.data;
      }

      key = undefined;
    } else {
      if (token.type === TokenType.BlockEnd) {
        break;
      }

      key = token.data;
    }
  }

  return result;
};

const _stringify = (
  obj: AnyObject,
  indent: boolean,
  tabSize: number,
): string => {
  let result = '';
  const tab = indent ? '  '.repeat(tabSize) : '';
  const eof = indent ? '\n' : '';
  const space = indent ? ' ' : '';

  for (const [key, value] of Object.entries(obj)) {
    result += `${tab}"${key}"${space}`;
    if (typeof value === 'string') {
      result += `"${value}"${eof}`;
    } else {
      const next = _stringify(value as AnyObject, indent, tabSize + 1)
        .trimEnd();
      result += `{${eof}${next}${eof}${tab}}${eof}`;
    }
  }

  return result;
};

export class ValveKV {
  public static parse(code: string): AnyObject {
    if (typeof code !== 'string') {
      throw new Error('code is not a string');
    }

    const result: AnyObject = {};
    const tokenizer = new Tokenizer(code + '\n');

    const key = tokenizer.nextToken();
    tokenizer.nextToken();

    result[key.data!] = _parse(tokenizer);

    return result;
  }

  public static stringify(obj: AnyObject, indent = false): string {
    return _stringify(obj, indent, 0);
  }
}
