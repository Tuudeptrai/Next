export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface ITrackTop{
        _id: string;
      title: string;
      description: string;
      category: string;
      imgUrl: string;
      trackUrl: string;
      countLike: number;
      countPlay: number;
      uploader: {
        _id:string;
        email:string;
        name:string;
        role:string;
        type:string;
      };
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string
    }
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[]
    }
    interface Isession{
        access_token:string;
        refresh_token:string;
        user: {
          "_id": string,
          "username":string,
          "email": string,
          "address": string,
          "isVerify": boolean,
          "type": string,
          "name": string,
          "role": string,
          "gender": string,
          "age": number,
          "provider":string,
          "image":string
        }
    }
    interface ItrackUpload{
        fileName:string,
        percent:number
    }
    interface ITrackContext{
        
        currentTrack: IshareTrack;
        setCurrentTrack: (v:IshareTrack)=>void;
    }
    interface IshareTrack extends ITrackTop{
        isPlaying:boolean;
    }
}
