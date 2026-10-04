/**
 * Small hand-written Java tokenizer for CodeBlock highlighting.
 * No libraries: single-pass scanner producing flat tokens
 * (keywords, strings, chars, comments, numbers, annotations).
 */

export type JavaTokenKind =
  | 'plain'
  | 'keyword'
  | 'string'
  | 'char'
  | 'comment'
  | 'number'
  | 'annotation';

export interface JavaToken {
  text: string;
  kind: JavaTokenKind;
}

const KEYWORDS = new Set([
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
  'var',
  'record',
  'sealed',
  'permits',
  'yield',
  'true',
  'false',
  'null',
]);

function isWordStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch);
}

function isWordPart(ch: string): boolean {
  return /[A-Za-z0-9_$]/.test(ch);
}

function isDigit(ch: string): boolean {
  return /[0-9]/.test(ch);
}

export function tokenizeJava(code: string): JavaToken[] {
  const tokens: JavaToken[] = [];
  let plain = '';
  let i = 0;

  function flushPlain() {
    if (plain !== '') {
      tokens.push({ text: plain, kind: 'plain' });
      plain = '';
    }
  }

  function push(text: string, kind: JavaTokenKind) {
    flushPlain();
    tokens.push({ text, kind });
  }

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1] ?? '';

    // Line comment
    if (ch === '/' && next === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i += 1;
      push(code.slice(start, i), 'comment');
      continue;
    }

    // Block comment
    if (ch === '/' && next === '*') {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i += 1;
      i = Math.min(code.length, i + 2);
      push(code.slice(start, i), 'comment');
      continue;
    }

    // String literal (with escapes)
    if (ch === '"') {
      const start = i;
      i += 1;
      while (i < code.length) {
        if (code[i] === '\\') {
          i += 2;
          continue;
        }
        if (code[i] === '"') {
          i += 1;
          break;
        }
        if (code[i] === '\n') break;
        i += 1;
      }
      push(code.slice(start, i), 'string');
      continue;
    }

    // Char literal (with escapes)
    if (ch === "'") {
      const start = i;
      i += 1;
      while (i < code.length) {
        if (code[i] === '\\') {
          i += 2;
          continue;
        }
        if (code[i] === "'") {
          i += 1;
          break;
        }
        if (code[i] === '\n') break;
        i += 1;
      }
      push(code.slice(start, i), 'char');
      continue;
    }

    // Annotation (@Override)
    if (ch === '@' && isWordStart(next)) {
      const start = i;
      i += 1;
      while (i < code.length && isWordPart(code[i])) i += 1;
      push(code.slice(start, i), 'annotation');
      continue;
    }

    // Number (ints, underscores, decimals, exponents, suffixes)
    if (isDigit(ch) || (ch === '.' && isDigit(next))) {
      const start = i;
      while (i < code.length && /[0-9_]/.test(code[i])) i += 1;
      if (code[i] === '.' && /[0-9_]/.test(code[i + 1] ?? '')) {
        i += 1;
        while (i < code.length && /[0-9_]/.test(code[i])) i += 1;
      }
      if ((code[i] === 'e' || code[i] === 'E') && /[0-9+-]/.test(code[i + 1] ?? '')) {
        i += 1;
        if (code[i] === '+' || code[i] === '-') i += 1;
        while (i < code.length && /[0-9_]/.test(code[i])) i += 1;
      }
      if (/[lLfFdD]/.test(code[i] ?? '')) i += 1;
      push(code.slice(start, i), 'number');
      continue;
    }

    // Word: keyword or plain
    if (isWordStart(ch)) {
      const start = i;
      while (i < code.length && isWordPart(code[i])) i += 1;
      const word = code.slice(start, i);
      push(word, KEYWORDS.has(word) ? 'keyword' : 'plain');
      continue;
    }

    plain += ch;
    i += 1;
  }

  flushPlain();
  return tokens;
}
