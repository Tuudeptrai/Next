'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import WareTrack from '@/components/track/wareTrack';
import { Container } from '@mui/material';
const DetailTrack = (props:any) => {
    const {params} = props;
    const searchParams = useSearchParams();
    const search = searchParams.get("audio");
    console.log('check>>>',search) 
    return (
        <>
            <div>
            <Container sx={{ marginTop: '20px' }}>
            <WareTrack />
            </Container>
                
            </div>
        </>
    );
};

export default DetailTrack;