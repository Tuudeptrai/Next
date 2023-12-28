'use client'
import AppHeader from "@/components/header/header";
import MainSlider from "@/components/main/mainSlider";
import {sendRequest} from '@/utils/Api'
import { useRouter } from 'next/navigation';
import { useSession ,SessionProvider } from 'next-auth/react';
export default async function HomePage() {
//   const { data: session } = useSession();
//   console.log('useSession', session);
//   const router = useRouter();
// if(!session){
//   router.push('/auth/signin');
// }
//   const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU4NjdmNDMzMDcwZDMzNTRhODc0NjFmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6IkZFTUFMRSIsImFnZSI6NjksImlhdCI6MTcwMzY4Nzg3OSwiZXhwIjoxNzkwMDg3ODc5fQ.VfDjPr7DrqNljefXMrxuvjYWxwXv4W1qja4G4Afh54U";
  //  call api
const chill = await sendRequest<IBackendRes<ITrackTop[]>>({
  url:"http://localhost:8000/api/v1/tracks/top",
  method:"POST",
  body: {
          category:"CHILL",
          limit: 10
        },   
})
const workout = await sendRequest<IBackendRes<ITrackTop[]>>({
  url:"http://localhost:8000/api/v1/tracks/top",
  method:"POST",
  body: {
          category:"WORKOUT",
          limit: 10
        },   
})
const party = await sendRequest<IBackendRes<ITrackTop[]>>({
  url:"http://localhost:8000/api/v1/tracks/top",
  method:"POST",
  body: {
          category:"PARTY",
          limit: 10
        },   
})

  return (
    
    <div>
      <MainSlider
      title={"Top Chill"}
      data={chill?.data??[]}
      />
      <MainSlider
      title={"Top Workout"}
      data={workout?.data??[]}
      />
      <MainSlider
      title={"Top Party"}
      data={party?.data??[]}
      />
    </div>
   
  );
}
