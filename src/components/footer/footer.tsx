'use client'
import { useHasMounted } from '@/utils/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';

import React, { useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useTrackContext } from '../lib/TrackWraper';

const AppFooter = () => {
    const {currentTrack , setCurrentTrack} = useTrackContext() as ITrackContext;
    const playerRef = useRef(null);
    const hasMounted = useHasMounted();
    
   
    useEffect(() => {
        if (currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
        if (currentTrack?.isPlaying === true) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
    }, [currentTrack])
    
    if(!hasMounted) return (<></>);
    return (
        <>
        
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0,backgroundColor:"#F2F2F2" }}>
            <Container sx={{display:"flex", gap:10, ".rhap_main":{gap: "20px"}}}>
                <AudioPlayer
                ref={playerRef}
                onPause={() => {
                    setCurrentTrack({ ...currentTrack, isPlaying: false })
                    }}
                onPlay={() => {
                    setCurrentTrack({ ...currentTrack, isPlaying: true })
                    }}
                layout='horizontal-reverse'
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}` }
                    
                    volume={0.5}
                    style={{boxShadow:"unset", backgroundColor:"#F2F2F2"}}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    minWidth: 100
                    }}>
                        <div style={{ color: "black" }}>{currentTrack.title}</div>
                    <div style={{ color: "#ccc" }}>{currentTrack.description}</div>
                    
                </div>
             </Container>
            </AppBar>
       
        
          
        </>
    );
};

export default AppFooter;