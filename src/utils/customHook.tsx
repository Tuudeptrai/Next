import { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js'
import { WaveSurferOptions } from 'wavesurfer.js';
export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}
export const useWavesurfer = (containerRef: React.RefObject<HTMLDivElement>, options:Omit<WaveSurferOptions,"container">) => {
    const [wavesurfer, setWavesurfer] = useState<any>(null)
  
    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
      if (!containerRef.current) return
  
      const ws = WaveSurfer.create({
        ...options,
        container: containerRef.current,
      })
  
      setWavesurfer(ws)
  
      return () => {
        ws.destroy()
      }
    }, [options, containerRef])
  
    return wavesurfer
  }
export const useScript = (url: string) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

