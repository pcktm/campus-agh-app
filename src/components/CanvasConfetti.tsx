/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactCanvasConfetti from 'react-canvas-confetti';
import React, {
  Ref, useCallback, useEffect, useState,
} from 'react';

export function CanvasBackgroundConfetti({fire}: {fire: boolean}) {
  const refAnimationInstance = React.useRef<any>(null);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        ...opts,
        origin: {y: 0.5},
        particleCount: Math.floor(200 * particleRatio),
      });
    }
  }, []);

  const fireFn = useCallback(() => {
    makeShot(0.5, {
      spread: 360,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.2, {
      spread: 360,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 360,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (fire) {
      fireFn();
    }
  }, [fire, fireFn]);

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      useWorker
      style={
      {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'visible',
      }
    }
    />
  );
}
