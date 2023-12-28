'use client'
// Import WaveSurfer
import WaveSurfer from 'wavesurfer.js'
import React, { useEffect, useRef, useState ,useMemo, useCallback} from 'react';
import { useSearchParams } from 'next/navigation';
import { WaveSurferOptions } from 'wavesurfer.js';
// WaveSurfer hook
import { useWavesurfer } from '@/utils/customHook';
import { Button } from '@mui/material';



const WareTrack = () => {
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsMemo = useMemo(():Omit<WaveSurferOptions,"container"> =>{
        // Create a canvas gradient
        const ctx = document.createElement('canvas').getContext('2d')!
        const gradient = ctx.createLinearGradient(0, 0, 0, 150)
        gradient.addColorStop(0, '#2f2f2f')
        gradient.addColorStop(0.7, '#ccc')
        gradient.addColorStop(1, 'rgb(0, 0, 0)')
        return {
            waveColor: gradient,
            progressColor: 'orange',
            url: `/api?audio=${fileName}`,
            barWidth:3,
            
        }
    },[]);
   
    const wavesurfer = useWavesurfer(containerRef, optionsMemo)
// On play button click
    const onPlayClick = useCallback(() => {
        if(wavesurfer){
            wavesurfer?.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
       
        } }, [wavesurfer])
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0)
    useEffect(() => {
        if (!wavesurfer) return
    
        setCurrentTime(0)
        setIsPlaying(false)
    
        const subscriptions = [
          wavesurfer.on('play', () => setIsPlaying(true)),
          wavesurfer.on('pause', () => setIsPlaying(false)),
          wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
        ]
    
        return () => {
          subscriptions.forEach((unsub) => unsub())
        }
      }, [wavesurfer])
    return (
        <>
            <div ref={containerRef}
            ></div>
            <Button color="success" onClick={()=>onPlayClick()}>{isPlaying ? `Pause-${currentTime}` : `Play`}</Button>
        </>
    );
};

export default WareTrack;