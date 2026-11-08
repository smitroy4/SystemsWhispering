import { JBox, JNote } from './javaPrimitives.tsx';

export default function CASRetryABAIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="CAS retry loops and ABA problem">
      <JBox x={40} y={30} w={300} title="CAS retry loop (Treiber stack)" rows={['AtomicReference<Node> head = new AtomicReference<>();', '', 'void push(Node newNode) {', '    Node oldHead = head.get();', '    newNode.next = oldHead;', '    if (!head.compareAndSet(oldHead, newNode)) {', '        // retry: another thread won', '        // loop or recurse', '    }', '}', '', 'Optimistic: spin until CAS succeeds']} />
      
      <JBox x={380} y={30} w={280} title="ABA problem" rows={['Thread 1 reads A', 'Thread 2: A → B → A', 'Thread 1 CAS: A → C (succeeds!)', 'But list changed: B was removed', 'Fix: AtomicStampedReference', 'Add version stamp to pointer']} tone="bad" />
      
      <JNote x={120} y={330}>CAS retry = spin until success. ABA = value A→B→A fools CAS. Stamp/version prevents ABA.</JNote>
    </svg>
  );
}
