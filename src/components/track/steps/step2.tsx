'use client'
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { error } from 'console';
import axios from 'axios';
import { useSession ,SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/toast/useToast';
import { sendRequest } from '@/utils/Api';
function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
function LinearWithValueLabel(props:any) {
    const [progress, setProgress] = React.useState(10);

    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.percent} />
        </Box>
    );
}
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload(props:any) {
    const { data: session } = useSession();
    const handleUploadImage = async (image:any)=>{
        const formData  = new FormData();
        formData.append("fileUpload", image);
         try {
          const res= await axios.post('http://localhost:8000/api/v1/files/upload', formData,{
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            "target_type":"images"
          },
         
        }
        );
        props.setInfo({
          ...props.info,
          imgUrl:res?.data?.data?.fileName
        });
        console.log('>>>check acceptedFiles',res?.data?.data?.fileName);
         } catch (error) {
          //@ts-ignore
          console.log('>>>check acceptedFiles',error?.response?.data?.message);
         }
    }
    return (
        <Button
            onChange={(e) => {  
                const event = e.target as HTMLInputElement;
                if(event.files) {
                    handleUploadImage(event.files[0])
                    console.log("evt.target.files: ", event.files[0])
                }
            }}
            component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}
interface INewTrack{
    title:string,
    description:string,
    trackUrl:string,
    imgUrl:string,
    category:string
}

const Step2 = (props:any) => {
    const { data: session } = useSession();
    const toast = useToast();
    const router = useRouter();
    const [errortile, setErrortitle] = useState(false);
    const [errordescription, setErrordescription] = useState(false);
    const [info, setInfo] = useState<INewTrack>({
        title:"",
        description:"",
        trackUrl:"",
        imgUrl:"",
        category:""
    });
    const handleSubmitForm =async()=>{
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url:"http://localhost:8000/api/v1/tracks",
            method:"POST",
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
              },
            body: {
                title:info.title,
                description:info.description,
                trackUrl:info.trackUrl,
                imgUrl:info.imgUrl,
                category:info.category
                  },   
          })
        console.log('handleSubmitForm res',res)
        if(res.data){
            
            toast.success("success create track");
            const timeoutId = setTimeout(() => {
                router.push("/");
              }, 2000);
            
        }else{
            console.log('res error',res.message)
            toast.error(res.message[0])
        }
        
    }
    const {trackUpload} = props;
    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        }
    ];
    useEffect(()=>{
        if(trackUpload&&trackUpload.tracksUrl){
            console.log('trackUpload',trackUpload)
            setInfo({
                ...info,
                trackUrl:trackUpload.tracksUrl
            })
        }
    },[trackUpload])
    console.log('info',info);
    return (
        <>
            <div>
                        <div>
                            {trackUpload.fileName}
                        </div>
                        <LinearWithValueLabel percent={trackUpload.percent}/>
                    </div>

                    <Grid container spacing={2} mt={5}>
                        <Grid item xs={6} md={4}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: "10px"
                            }}
                        >
                            <div style={{ height: 250, width: 250, background: "#ccc" }}>
                                <div>
                                    {info.imgUrl &&
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} width={250} height={250}/>
                                    }
                                </div>

                            </div>
                            <div >
                                <InputFileUpload info={info} setInfo={setInfo}/>
                            </div>

                        </Grid>
                        <Grid item xs={6} md={8}>
                            <TextField  
                             required
                             error={errortile}
                             helperText={errortile ? 'title cannot be empty' : ''}
                                value={info?.title}
                                onChange={(e)=>{
                                    setInfo({
                                        ...info, title:e.target.value
                                    })
                                    setErrortitle(e.target.value.trim() === '');
                                   }}
                                label="Title" variant="standard" fullWidth margin="dense" />
                            <TextField 
                             required
                             error={errordescription}
                             helperText={errordescription ? 'Description cannot be empty' : ''}
                                value={info?.description}
                                onChange={(e)=>{
                                    setInfo({
                                        ...info, description:e.target.value
                                    })
                                    setErrordescription(e.target.value.trim() === '');
                                }}
                                label="Description" variant="standard" fullWidth margin="dense" />
                            <TextField
                             required
                                value={info?.category}
                                onChange={(e)=>{
                                    setInfo({
                                        ...info, category:e.target.value
                                    })
                                }}
                                sx={{
                                    mt: 3
                                }}
                                select
                                label="Category"
                                fullWidth
                                variant="standard"
                            //   defaultValue="EUR"
                            >
                                {category.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                onClick={()=>handleSubmitForm()}
                                variant="outlined"
                                sx={{
                                    mt: 5
                                }}>Save</Button>
                        </Grid>
                    </Grid>

        </>
    );
};

export default Step2;