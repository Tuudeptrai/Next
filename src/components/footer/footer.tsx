'use client'
import { useHasMounted } from '@/utils/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';

import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    if(!hasMounted) return (<></>);
    return (
        <>
        
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0,backgroundColor:"#F2F2F2" }}>
            <Container sx={{display:"flex", gap:10}}>
                <AudioPlayer
                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
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
                    <div style={{ color: "#ccc" }}>Eric</div>
                    <div style={{ color: "black" }}>Who am I ?</div>
                </div>
             </Container>
            </AppBar>
       
        
          
        </>
    );
};

export default AppFooter;