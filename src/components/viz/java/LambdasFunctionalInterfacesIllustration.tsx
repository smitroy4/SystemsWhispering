import { JBox, JNote } from './javaPrimitives.tsx';

export default function LambdasFunctionalInterfacesIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Lambdas and functional interfaces">
      <JBox x={40} y={30} w={300} title="Lambda syntax" rows={['// Zero params', '() -> System.out.println("hi")', '', '// One param (parens optional)', 's -> s.length()', '', '// Multiple params', '(a, b) -> a + b', '', '// Block body', 's -> {', '    int len = s.length();', '    return len > 5;', '}']} />
      
      <JBox x={380} y={30} w={280} title="Built-in functional interfaces" rows={['Predicate<T>      : T -> boolean', 'Consumer<T>      : T -> void', 'Function<T,R>    : T -> R', 'Supplier<T>      : () -> T', 'UnaryOperator<T> : T -> T', 'BinaryOperator<T>: (T,T) -> T', 'BiFunction<T,U,R> : (T,U) -> R']} tone="good" />
      
      <JNote x={120} y={330}>Lambda = anonymous function. Target typing: inferred from context. Effectively final captured variables.</JNote>
    </svg>
  );
}
