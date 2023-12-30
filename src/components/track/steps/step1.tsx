import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import "./theme.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { sendRequest, sendRequestFile } from '@/utils/Api';
import { useSession ,SessionProvider } from 'next-auth/react';
import axios from 'axios';


const Step1 = (props:any) => {
  const { data: session } = useSession();
  const {trackUpload} = props;
  const onDrop = useCallback(async(acceptedFiles: FileWithPath[])=> {
    // Do something with the files
    if(acceptedFiles&&acceptedFiles[0]){
      props.setValue(1);
      const audio = acceptedFiles[0];
      const formData  = new FormData();
      formData.append("fileUpload", audio);
       try {
        const res= await axios.post('http://localhost:8000/api/v1/files/upload', formData,{
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          "target_type":"tracks",
          delay:5000
        },
        onUploadProgress: progressEvent => {
          let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
          console.log('percentCompleted',percentCompleted);
          props.setTrackUpload({
            ...trackUpload,
            fileName:acceptedFiles[0].name,
            percent:percentCompleted
          });
          
        }
      }
      );
      props.setTrackUpload((prevState:any)=>({
        ...prevState,
        tracksUrl:res?.data?.data?.fileName
      }));
      console.log('>>>check acceptedFiles',res?.data?.data?.fileName);
       } catch (error) {
        //@ts-ignore
        console.log('>>>check acceptedFiles',error?.response?.data?.message);
       }
      
    }
   
  }, [session])
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({onDrop,
    accept:{"audio":[".mp3", ".m4a", ".wav"]}
    });
    const files = acceptedFiles.map((file :FileWithPath)=> (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));
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
    return (
      
             <section className="container">
                <div {...getRootProps({className: 'dropzone'})}>
                   
                    <p>Drag 'n' drop some files here, or click to select files (mp3,m4a,wav)</p>
                    <Button onClick={(e)=>e.preventDefault()} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                      Upload file
                      <VisuallyHiddenInput type="file" />
                      <input {...getInputProps()}  />
                    </Button>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
                </section>
       
    );
};

export default Step1;