
'use client'
import React from 'react';
import { Box, Button, Container, Divider } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Iprops{
    data:ITrackTop[]
}

const MainSlider = (props:Iprops) => {
    
    const NextArrow =(props:any)=>{
        const {onClick} = props;
        return(
            <Button variant="outlined"
                onClick={props.onClick}

                            sx={{  position: "absolute",
                                   right: 0,
                                   top: "43%",
                                   zIndex: 2,
                                   minWidth: 30,
                                   width: 35,

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
                                   top: "43%",
                                   zIndex: 2,
                                   minWidth: 30,
                                   width: 35,

                            }}> 
                            <ChevronLeft/>
                            </Button>
        )
    }
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
      slidesToScroll: 3,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
      };
      return (
        <Container>
            <Box
            sx = {{
                margin: "0 50px",
                ".abc": {
                  padding: "0 10px",
                },
                "h3": {
                  border: "1px solid #ccc",
                  padding: "20px",
                  height: "200px"
                }
              }}
            >
                <h2>Multy Track</h2>
                <Slider {...settings}>
                <div className='abc'>
                    <h3>Track 1</h3>
                </div>
                <div className='abc'>
                    <h3>Track 2</h3>
                </div>
                <div className='abc'>
                    <h3>Track 3</h3>
                </div >
                <div className='abc'>
                    <h3>Track 4</h3>
                </div>
                <div className='abc'>
                    <h3>Track 5</h3>
                </div>
                <div className='abc'>
                    <h3>Track 6</h3>
                </div>
                </Slider>
                <Divider />
            </Box>
            
        </Container>
        
      );
};

export default MainSlider;