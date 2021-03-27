import {
   LOGIN_SUCCESS,
   LOGOUT_SUCCESS,
   PAGE,
   FOLDER_CREATED,
   FILE_UPLOADED,
   FOLDER_NAME ,
   FOLDER_LIST ,
   FILE_LIST,
   UPPY_SUCCESS,
   UPPY_FAILED,
   UPPY_BATCHID
} from './types'

const localUserId = localStorage.getItem('userId');
const localToken = localStorage.getItem('token');
const localUserName = localStorage.getItem('userName');

export const initialState = {
   token: localToken ? localToken : null,
   userId: localUserId ? localUserId : null,
   userName: localUserName ? localUserName : null,
   page: 'my-videos',
   folderCreated: null,
   fileUploaded: null,
   folderName: '' ,
   folderList : [],
   fileList : [],
   uppySuccess : [],
   uppyFailed : [],
   uppyBatchId : null 
}

export const reducer = (state = initialState, action) => {
   switch (action.type) {
      case LOGIN_SUCCESS:
         localStorage.setItem('token', action.payload.token);
         localStorage.setItem('userId', action.payload.userId);
         localStorage.setItem('userName', action.payload.userName);
         return {
            ...state,
            token: action.payload.token,
            userId: action.payload.userId,
            userName: action.payload.userName,
            page: action.payload.page
         }

      case LOGOUT_SUCCESS:
         localStorage.removeItem('token');
         localStorage.removeItem('userId');
         localStorage.removeItem('userName');
         return {
            token: null,
            userId: null,
            userName: null,
            page: 'login'
         }

      case PAGE:
         return {
            ...state,
            page: action.payload.page
         }

      case FOLDER_CREATED:
         return {
            ...state,
            folderCreated: action.payload.folderCreated
         }

      case FILE_UPLOADED:
         return {
            ...state,
            fileUploaded: action.payload.fileName
         }

      case FOLDER_NAME:
         return {
            ...state,
            folderName: action.payload.folderName
         }
      
      case FOLDER_LIST:
         return {   ...state,  folderList : action.payload.folderList}
      
      case FILE_LIST:
         return {   ...state,  fileList : action.payload.fileList}
      
      case UPPY_SUCCESS:
         return {   ...state,  uppySuccess : action.payload.uppySuccess}

      case UPPY_FAILED:
         return {   ...state,  uppyFailed : action.payload.uppyFailed}

      case UPPY_BATCHID:
         return {  ...state,  uppyBatchId: action.payload.uppyBatchId}
      
      default:
         return state;
   }
}