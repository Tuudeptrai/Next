'use client'
// Import WaveSurfer
import WaveSurfer from 'wavesurfer.js'
import React, { useEffect, useRef, useState ,useMemo} from 'react';
import { useSearchParams } from 'next/navigation';
import { WaveSurferOptions } from 'wavesurfer.js';
// WaveSurfer hook
import { useWavesurfer } from '@/utils/customHook';



const WareTrack = () => {
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsMemo = useMemo(()=>{
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        }
    },[]);
   
    const wavesurfer = useWavesurfer(containerRef, optionsMemo)

    return (
        <>
            <div ref={containerRef}
            ></div>
        </>
    );
};

export default WareTrack;