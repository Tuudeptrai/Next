
'use client'
import React from 'react';
import { Box, Button, Container, Divider } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Link from 'next/link';

interface Iprops{
    data:ITrackTop[],
    title:string
}

const MainSlider = (props:Iprops) => {
    // console.log('check data >>> ',props.data)
    const {data, title} = props;
    const NextArrow =(props:any)=>{
        const {onClick} = props;
        return(
            <Button variant="outlined"
                onClick={props.onClick}

                            sx={{  position: "absolute",
                                   right: 0,
                                   top: "20%",
                                   zIndex: 2,
                                   minWidth: 30,
                                   width: 35,
                                   backgroundColor:"#F2F2F2",

                            }}>
                                <ChevronRight/>
                            </Button>
        )
    }
    const PrevArrow =(props:any)=>{
        const {onClick} = props;
        return(
            <Button variant="outlined"
                onClick={props.onClick}

                            sx={{  position: "absolute",
                                   left: 0,
                                   top: "20%",
                                   zIndex: 2,
                                   minWidth: 30,
                                   width: 35,
                                   backgroundColor:"#F2F2F2",

                            }}> 
                            <ChevronLeft/>
                            </Button>
        )
    }
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
      slidesToScroll: 6,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
      };
      return (
        <Container>
            <Box
            sx = {{
                margin: "0 50px",
                ".track": {
                
                  padding: "0 10px",
                  "img":{
                    borderRadius:"5px",
                    height:150,
                    width:150
                  },
                  "a":{
                    textDecoration:"unset",
                    color:"black"
                  }
                },
                "h3": {
                  border: "1px solid #ccc",
                  padding: "20px",
                  height: "200px"
                }
              }}
            >
               <h2> {title} </h2>
                <Slider {...settings}>
                    {data.map(track => {
                         return (
                        <div className="track" key={track._id}>
                         <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}/>
                            <Link href={`/track/${track._id}?audio=${track.trackUrl}`}>
                            <h4>{track.title}</h4>
                            <h5>{track.description}</h5>
                            </Link>
                            
                         </div>)})}

                </Slider>
                <Divider/>
                
            </Box>
            
        </Container>
        
      );
};

export default MainSlider;