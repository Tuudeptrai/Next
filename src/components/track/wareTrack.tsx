'use client'
import React, { useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js'

const WareTrack = () => {
    useEffect(()=>{
        const element =document.getElementById("audioTrack");
        if( element){
            const wavesurfer = WaveSurfer.create({
                container: element,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: '/audio/hoidanit.mp3',
              })
        }
        
    },[])
    return (
        <>
            <div
            id="audioTrack"
            >WareTrack</div>
        </>
    );
};

export default WareTrack;