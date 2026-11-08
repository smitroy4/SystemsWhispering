import { JBox, JNote } from './javaPrimitives.tsx';

export default function ProcessesVsThreadsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Process vs thread memory model">
      <JBox x={40} y={30} w={280} title="Process" rows={['Own virtual address space', 'Own file descriptors', 'Own heap, stack', 'Own registers', 'Isolated from other processes', 'IPC required to communicate']} />
      
      <JBox x={380} y={30} w={280} title="Thread (within process)" rows={['Shares process heap', 'Shares code, globals', 'Own stack (private)', 'Own PC, registers', 'Own thread-local storage', 'Fast context switch']} tone="good" />
      
      <JNote x={120} y={180}>Process = heavy isolation. Thread = lightweight, shared memory. Java maps 1 thread → 1 OS thread (platform thread).</JNote>
    </svg>
  );
}
