import React from 'react';
import WareTrack from '@/components/track/wareTrack';
import { Container } from '@mui/material';
import { sendRequest } from '@/utils/Api';

const DetailTrack = async(props:any) => {
    const { params } = props;

    const res = await sendRequest<IBackendRes<IshareTrack>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })
    console.log('res>>>>>>>>>>>>>>',res)
    return (
       
          
            <Container sx={{ marginTop: '20px' }}>
            <WareTrack track={res?.data??null}/>
            </Container> 
       
    );
};

export default DetailTrack;