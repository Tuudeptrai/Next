import React from 'react';
import WareTrack from '@/components/track/wareTrack';
import { Container } from '@mui/material';
import { sendRequest } from '@/utils/Api';
export interface ITrackComment{
    "_id": string,
    "content": string,
    "moment": number,
    "user": {
        "_id": string,
        "email": string,
        "name": string,
        "role": string,
        "type": string
    },
    "track": {
        "_id": string,
        "title": string,
        "description": string,
        "trackUrl": string
    },
    "isDeleted": boolean,
    "createdAt": string,
    "updatedAt": string
}
const DetailTrack = async(props:any) => {
    const { params } = props;

    const res = await sendRequest<IBackendRes<IshareTrack>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })
    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
          current: 1,
          pageSize: 100,
          trackId: params.slug,
          sort: "-createdAt"
        },
      })
      
    console.log('res>>>>>>>>>>>>>>',res1)
    return (
       
          
            <Container sx={{ marginTop: '20px' }}>
            <WareTrack track={res?.data??null} comments={res1?.data??null}/>
            </Container> 
       
    );
};

export default DetailTrack;