/**
 * java-platform-and-execution — 2 visuals.
 * 1. JDK ⊃ JRE ⊃ JVM nested hierarchy (static, click-highlighted boxes).
 * 2. .java → javac → bytecode → class loader → JVM execution pipeline (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: JDK ⊃ JRE ⊃ JVM nested hierarchy ---------------- */

function JdkHierarchy() {
  const active: 'jdk' | 'jre' | 'jvm' | null = null;
  const tone = (layer: 'jdk' | 'jre' | 'jvm') =>
    active === layer ? 'active' : 'default';

  return (
    <svg className="viz-svg" viewBox="0 0 620 330" role="img" aria-label="JDK contains JRE contains JVM nesting">
      <JBox x={30} y={40} w={560} h={250} title="JDK (Java Development Kit)" tone={tone('jdk')} />
      <JBox x={100} y={80} w={420} h={170} title="JRE (Java Runtime Environment)" tone={tone('jre')} />
      <JBox x={170} y={120} w={280} h={90} title="JVM (Java Virtual Machine)" tone={tone('jvm')} />
      <JBox x={240} y={145} w={140} h={40} title="Execution engine" tone="default" />
      <JArrow x1={300} y1={185} x2={310} y2={240} label="runs bytecode" />
      <JNote x={30} y={300}>
        Click a layer. JDK = JRE + dev tools (javac, jar, javadoc). JRE = JVM + core libraries. JVM = interpreter + JIT + GC + class loader.
      </JNote>
    </svg>
  );
}

/* ---------------- Visual 2: execution pipeline (animated) ---------------- */

const PIPELINE_STEPS: VizStep[] = [
  {
    id: 'source',
    description: 'Developer writes Hello.java source code.',
    state: { active: 'source' },
  },
  {
    id: 'javac',
    description: 'javac compiles .java to .class bytecode (constant pool, instructions, StackMapTable).',
    state: { active: 'javac' },
  },
  {
    id: 'classloader',
    description: 'Class loader loads, links, verifies, then initializes the class.',
    state: { active: 'classloader' },
  },
  {
    id: 'jvm',
    description: 'JVM execution engine runs bytecode: interpreter starts, JIT compiles hot methods.',
    state: { active: 'jvm' },
  },
];

function renderPipeline(step: VizStep | undefined) {
  const active = step?.state as { active?: string } ?? {};
  const boxes = [
    { key: 'source', x: 40, y: 60, title: 'Hello.java', sub: 'source code' },
    { key: 'javac', x: 210, y: 60, title: 'javac', sub: 'compiler' },
    { key: 'classloader', x: 380, y: 60, title: 'Class Loader', sub: 'load / verify / init' },
    { key: 'jvm', x: 480, y: 150, title: 'JVM', sub: 'interpreter + JIT' },
  ];
  return (
    <svg className="viz-svg" viewBox="0 0 700 300" role="img" aria-label="Java execution pipeline">
      {boxes.map((b) => (
        <JBox
          key={b.key}
          x={b.x}
          y={b.y}
          w={150}
          h={70}
          title={b.title}
          rows={[b.sub]}
          tone={active.active === b.key ? 'active' : 'default'}
        />
      ))}
      <JArrow x1={190} y1={95} x2={210} y2={95} label="compile" />
      <JArrow x1={360} y1={95} x2={380} y2={95} label="load" />
      <JArrow x1={530} y1={95} x2={480} y2={150} label="run" />
      <JNote x={40} y={270}>
        One .class artifact runs on any platform with a JVM — Write Once, Run Anywhere.
      </JNote>
    </svg>
  );
}

function ExecutionPipeline() {
  return (
    <VizPlayer steps={PIPELINE_STEPS} render={renderPipeline} autoPlay={false} />
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'JDK ⊃ JRE ⊃ JVM hierarchy',
    caption: 'The Java platform is three nested layers.',
    notice: 'Only the JDK contains development tools such as javac; end users need just the JRE.',
    component: JdkHierarchy,
  },
  {
    title: 'Execution pipeline',
    caption: '.java → javac → bytecode → class loader → JVM (interpreter/JIT).',
    notice: 'Hot methods are promoted by the JIT; cold code stays interpreted (tiered compilation).',
    component: ExecutionPipeline,
  },
];
