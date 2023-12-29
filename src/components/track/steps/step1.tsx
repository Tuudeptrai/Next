import React, { useCallback } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import "./theme.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { sendRequest, sendRequestFile } from '@/utils/Api';
import { useSession ,SessionProvider } from 'next-auth/react';

const Step1 = () => {
  const { data: session } = useSession();
  const onDrop = useCallback(async(acceptedFiles: FileWithPath[])=> {
    // Do something with the files
    if(acceptedFiles&&acceptedFiles[0]){
      const audio = acceptedFiles[0];
      const formData  = new FormData();
      formData.append("fileUpload", audio);
      const chill = await sendRequestFile<IBackendRes<ITrackTop[]>>({
        url:"http://localhost:8000/api/v1/files/upload",
        method:"POST",
        body: formData, 
        headers: {
                'Authorization': `Bearer ${session?.access_token}`,
                "target_type":"tracks"
              },  
      })
      console.log('>>>check acceptedFiles',audio);
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