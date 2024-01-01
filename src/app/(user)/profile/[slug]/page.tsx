
import ProfileTracks from "@/components/track/CardTrack";
import { sendRequest } from "@/utils/Api";
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';

const ProfileUserPage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;

    const data = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: { id: slug }
    })

    
    //@ts-ignore
    const d = data?.data?.result ?? []
    console.log('dataProfileUserPage ',d)
    return (

        <Container sx={{ my: 5 }}>
            <Grid container spacing={5}>
                {d.map((item: any, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <ProfileTracks data={item} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>

    )
}

export default ProfileUserPage;