'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import WareTrack from '@/components/track/wareTrack';

const DetailTrack = (props:any) => {
    const {params} = props;
    const searchParams = useSearchParams();
    const search = searchParams.get("audio");
    console.log('check>>>',search) 
    return (
        <>
            <div>DetailTrack
                <WareTrack/>
            </div>
        </>
    );
};

export default DetailTrack;