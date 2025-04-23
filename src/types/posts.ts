import { TUser } from "./user";

export interface IImage {
  image: string;
  localPath: string;
  _id?: string;
}

export interface IComment {
  ownerId: string;
  postid: string;
  content: string;
  images: string[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageResponse {
  message: string;
  image: ImageDetails;
}

interface ImageDetails {
  image: string;
  localPath: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ICreatePostData {
  title: string;
  content: string;
  password: string;
  isLocked: boolean;
  visibleTo: IMention[];
  images: File[];
}

export interface PostDocument {
    _id: string;
    comments: any[];
    content: string;
    isLocked: boolean;
    title: string;
    images: any[];
    user: TUser;
    password?: string;
    visibleTo: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

export interface PostResponse {
    posts: PostDocument[];
}

export interface IPostComment {
  id?: string;
  ownerId: string;
  content: string;
  createdAt?: Date;
}

export interface IMention {
  userId: string ;
  name: string;
}

export interface IPost {
  _id: string;
  id: string;
  user: TUser;
  title: string;
  content: string;
  password?: string;
  isLocked: boolean;
  createdAt?: string;
  visibleTo: IMention[];
  images: IImage[];
  comments: IPostComment[] | [];
}


export interface PostPayload {
  _id: string;
  id: string;
  ownerId: string ;
  title: string;
  content: string;
  password: string;
  isLocked: boolean;
  visibleTo?: IMention[];
  images?: string[];
  comments?: IPostComment[] | [];
}