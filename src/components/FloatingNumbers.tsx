import { useState, useEffect } from 'react';

interface FloatingNumber {
  id: string;
  value: number;
  x: number;
}

interface FloatingNumbersProps {
  trigger: number; // The value that triggers animations (bugsFixed)
}

export default function FloatingNumbers({ trigger }: FloatingNumbersProps) {
  const [numbers, setNumbers] = useState<FloatingNumber[]>([]);
  const [lastTrigger, setLastTrigger] = useState(trigger);

  useEffect(() => {
    if (trigger > lastTrigger) {
      const diff = trigger - lastTrigger;
      if (diff > 0) {
        const newNumber: FloatingNumber = {
          id: `float-${Date.now()}-${Math.random()}`,
          value: diff,
          x: Math.random() * 100 - 50, // Random x offset
        };
        
        setNumbers(prev => [...prev, newNumber]);
        setLastTrigger(trigger);
        
        // Remove the number after animation
        setTimeout(() => {
          setNumbers(prev => prev.filter(n => n.id !== newNumber.id));
        }, 1500);
      }
    }
  }, [trigger, lastTrigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {numbers.map(number => (
        <div
          key={number.id}
          className="absolute text-green-400 font-bold text-lg animate-bounce"
          style={{
            left: `calc(50% + ${number.x}px)`,
            top: '25%',
            animation: 'fadeUpOut 1.5s ease-out forwards'
          }}
        >
          +{number.value}
        </div>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeUpOut {
            0% {
              opacity: 1;
              transform: translateY(0px);
            }
            100% {
              opacity: 0;
              transform: translateY(-60px);
            }
          }
        `
      }} />
    </div>
  );
}