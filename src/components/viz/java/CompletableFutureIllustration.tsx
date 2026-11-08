import { JBox, JNote } from './javaPrimitives.tsx';

export default function CompletableFutureIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="CompletableFuture composition">
      <JBox x={40} y={30} w={300} title="Creation & completion" rows={['CompletableFuture.supplyAsync(() -> fetch())', 'CompletableFuture.completedFuture(val)', 'CompletableFuture.failedFuture(ex)', 'cf.complete(value)', 'cf.completeExceptionally(ex)']} />
      
      <JBox x={380} y={30} w={280} title="Composition" rows={['cf.thenApply(x -> x * 2)', 'cf.thenCompose(x -> fetchMore(x))', 'cf.thenAccept(x -> System.out.println(x))', 'cf.thenRun(() -> cleanup())', 'cf1.thenCombine(cf2, (a,b) -> a+b)']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="Error handling" rows={['cf.exceptionally(ex -> fallback)', 'cf.handle((result, ex) -> fallback)', 'cf.whenComplete((r, ex) -> cleanup)', 'allOf(cf1, cf2).thenRun(...)', 'anyOf(cf1, cf2).thenAccept(...)']} tone="good" />
      
      <JNote x={120} y={330}>CompletableFuture = async pipeline. Compose without blocking. Use supplyAsync for async start.</JNote>
    </svg>
  );
}
