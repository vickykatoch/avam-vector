import React, { MutableRefObject } from 'react';
import './App.css';
import { useMouseEvents } from 'beautiful-react-hooks';
import * as calc from './utils/calculator';
import HookTester from './components';

function App() {
  const splitter = React.useRef<HTMLDivElement>(null);
  const { onMouseMove, onMouseUp } = useMouseEvents();
  const { onMouseDown } = useMouseEvents(splitter as MutableRefObject<HTMLDivElement>);
  const [isDragged, setIsDragged] = React.useState(false);
  const [startPos, setStartPos] = React.useState(0);

  onMouseDown((e: any) => {
    console.log(e.clientX);
    setStartPos(e.clientX);

    debugger;

    const x = onMouseMove((e: any) => {
      console.log(e);
    });
    console.log(x);
    const up = onMouseUp((e: any) => {
      console.log(e);
    });

  });
  React.useEffect(() => {
    const response = calc.gcd(8, 36, 32);
    console.log(response);
  }, []);
  // useDragEvents()

  return (
    <div className="App d-flex">
      <HookTester />
    </div>
  );
}

export default App;
