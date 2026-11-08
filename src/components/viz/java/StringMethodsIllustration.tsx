import { JBox, JNote } from './javaPrimitives.tsx';

export default function StringMethodsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="String methods, StringBuilder, StringBuffer">
      {/* common methods */}
      <JBox x={40} y={30} w={300} title="Common String methods" rows={['length()', 'charAt(i), codePointAt(i)', 'substring(begin, end)', 'indexOf(str), lastIndexOf(str)', 'contains(str)', 'startsWith(prefix), endsWith(suffix)', 'replace(old, new)', 'toLowerCase(), toUpperCase()', 'trim(), strip()', 'split(regex)', 'join(delimiter, elements)']} />
      
      <JBox x={380} y={30} w={280} title="StringBuilder vs StringBuffer" rows={['StringBuilder:', '  - Not thread-safe', '  - Fast (no synchronization)', '  - Preferred for single-thread', '', 'StringBuffer:', '  - Thread-safe (synchronized)', '  - Slower', '  - Legacy, rarely needed', '', 'String:', '  - Immutable', '  - s += "x" creates new object']} />
      
      <JNote x={120} y={330}>String immutable. StringBuilder for building strings in loops. StringBuffer only for legacy thread-safe code.</JNote>
    </svg>
  );
}
