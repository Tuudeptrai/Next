'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from 'wavesurfer.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './wave.scss';
import { Box, TextField, Tooltip } from "@mui/material";
import { fetchDefaultImages, sendRequest } from "@/utils/Api";
import { useTrackContext } from "../lib/TrackWraper";
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ITrackComment } from "@/app/(user)/track/[slug]/page";
import LikeTrack from "./LikeTrack";

interface IProps {
    track: IshareTrack | null;
}
const WaveTrack = (props:any) => {
    dayjs.extend(relativeTime)
    const { data: session } = useSession() ;
    const { comments} = props;
    const track = props;
    const [yourComment, setYourComment] = useState("");
    const router = useRouter();
    const {currentTrack , setCurrentTrack} = useTrackContext() as ITrackContext;
    
    // console.log('track',track);
    
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const firstView =  useRef(true);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");


    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;
        if (typeof window !== "undefined") {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`,
        }
    }, []);
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
// Define a state to store the current time of Wavesurfer
    const [currentWaveSurferTime, setCurrentWaveSurferTime] = useState(0);

    const id = searchParams.get("id");
    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);

        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.once('interaction', () => {
                wavesurfer.play()
            })
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])

    // On play button click
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer]);

   

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack])

    useEffect(() => {
        if (track.track?._id && !currentTrack?._id)
            setCurrentTrack({ ...track.track, isPlaying: false })
    }, [])


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

   

    const calLeft = (moment: number) => {
        const hardCodeDuration = 199;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }
    const handleSubmit = async () => {
        try {
          const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: 'http://localhost:8000/api/v1/comments',
            method: 'POST',
            body: {
              content: yourComment,
              moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
              track: track.track?._id,
            },
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          });
          if (res.data) {
            setYourComment('');
            router.refresh();
          }
        } catch (error) {
          console.error('Error submitting comment:', error);
        }
      };
    const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
        const duration = wavesurfer.getDuration();
        const seekPosition = moment / duration;
        wavesurfer.seekTo(seekPosition);
        wavesurfer.play();
    }
    };

    const  handleIncreaseView = async()=> {
        if(firstView.current)
            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: "http://localhost:8000/api/v1/tracks/increase-view",
                method: "POST",
                body: {
                  trackId: track.track?._id
                }});
                router.refresh();
                firstView.current = false;
        }
     
    
    return (
        <div style={{ marginTop: 20 }}>
            <div
                style={{
                    display: "flex",
                    gap: 15,
                    padding: 20,
                    height: 400,
                    background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)"
                }}
            >
                <div className="left"
                    style={{
                        width: "75%",
                        height: "calc(100% - 10px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div
                                onClick={() =>{
                                    onPlayClick();
                                    handleIncreaseView();
                                } }
                                style={{
                                    borderRadius: "50%",
                                    background: "#f50",
                                    height: "50px",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                    :
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px",
                                background: "#333",
                                fontSize: 30,
                                width: "fit-content",
                                color: "white"
                            }}>
                                {track.track?.title }
                            </div>
                            <div style={{
                                padding: "0 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white"
                            }}
                            >
                                 {track.track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time" >{time}</div>
                        <div className="duration" >{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc"
                                backdropFilter: "brightness(0.5)"
                            }}
                        ></div>
                        <div className="comments"
                            style={{ position: "relative" }}
                        >
                            {
                              comments.result.map((item :any)=> {
                                    return (
                                        <Tooltip  title={item.content} arrow key={item.id}>
                                             <img
                                            onPointerMove={(e) => {  const hover = hoverRef.current!;
                                            hover.style.width = calLeft(item.moment+3)
                                             }}
                                            key={item.id}
                                            style={{
                                                height: 20, width: 20,
                                                position: "absolute",
                                                top: 71,
                                                zIndex: 20,
                                                left: calLeft(item.moment)
                                            }}
                                            src={fetchDefaultImages(item.user?.type)}
                                        />
                                        </Tooltip>
                                       
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="right"
                    style={{
                        width: "25%",
                        padding: 15,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div style={{
                        background: "#ccc",
                        width: 250,
                        height: 250
                    }}>
                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.track?.imgUrl}`} width={250} height={250}/>
                    </div>
                </div>
            </div>
            <div style={{ top:"20px", width: "100%", alignItems: "center" }}>
            <LikeTrack track={track.track}/>
            </div>
            <div style={{ top:"20px", width: "100%", alignItems: "center" }}>
                    {session?.user && (
                            <TextField
                                value={yourComment}
                                onChange={(e) => setYourComment(e.target.value)}
                                fullWidth
                                label="Comments"
                                variant="standard"
                                onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault(); 
                                    handleSubmit();
                                }
                                }}
                            />
                            )}

            </div>
            <div style={{ display: "flex", gap: 15,   padding: 20,  height:"100%"  }}>
                    <div className="left"
                             style={{
                                width: "25%",
                                padding: 15,
                                alignItems: "center"
                            }}
                        >
                           <div>
                           
                            <img style={{ textAlign:"center",width: 150, height: 150,borderRadius:"50%"}} src=
                                { //@ts-ignore
                                fetchDefaultImages(session?.user?.type)
                                }
                            />
                            </div>
                          
                           <div><p>{session?.user.email}</p></div>
                           
                        </div>
                    <div className="right"
                            style={{
                                width: "75%",
                                height: "calc(100% - 10px)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                           
                        >{
                            comments.result.map((comment:any)=>{
                                return (
                                    
                                    <Box key={comment._id} sx={{ display: "flex", gap: "10px", justifyContent:"space-between"}}>
                                    <Box sx={{ display: "flex", gap: "10px", marginBottom: "25px", alignItems: "center" }}>
                                        <img
                                        style={{ height: 40, width: 40 }}
                                        src={fetchDefaultImages(comment?.user?.type)}
                                        />
                                        <div>
                                        <div style={{ fontSize: "13px" }}>
                                           <span 
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleJumpTrack(comment.moment)}
                                            > {comment?.user?.name ?? comment?.user?.email} at {formatTime(comment.moment)}
                                            </span>
                                        </div>
                                        <div>{comment.content}</div>
                                        </div>
                                    </Box>
                                    <div style={{ fontSize: "12px", color: "#999" }}>{dayjs(comment.createdAt)?.fromNow()}</div>
                                    </Box>
                                )
                               
                            })
                        }
                        

                    </div>
            </div>
        </div >
        
    )
}

export default WaveTrack;


