
import React, { useEffect, useRef, useState } from 'react';

declare const window: any;

interface Props {
  onShot: (shot: any) => void;
}

export const CameraView: React.FC<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const pose = new window.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results: any) => {
      if (results.poseLandmarks) {
        // Expose landmarks globally for GameView to pick up
        window.fullPoseLandmarks = results.poseLandmarks;
      }
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await pose.send({ image: videoRef.current });
      },
      width: 1280,
      height: 720
    });

    camera.start().then(() => setModelLoaded(true));

    return () => {
      camera.stop();
      pose.close();
    };
  }, []);

  return (
    <div className="hidden">
      <video ref={videoRef} playsInline />
    </div>
  );
};
