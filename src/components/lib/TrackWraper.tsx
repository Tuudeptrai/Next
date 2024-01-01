'use client';

import { createContext, useContext, useState } from "react";

export const TrackContext = createContext<ITrackContext|null>(null)

export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const initValue={
        _id: "",
        title: "",
        description: "",
        category: "",
        imgUrl: "",
        trackUrl: "",
        countLike: 0,
        countPlay: 0,
        uploader: {
          _id: "",
          email: "",
          name: "",
          role: "",
          type: "",
        },
        isDeleted: false,
        isPlaying:false,
        createdAt: "",
        updatedAt: ""
    }
    const [currentTrack, setCurrentTrack] = useState<IshareTrack>(initValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    )
};

export const useTrackContext = ():ITrackContext|null => useContext(TrackContext);