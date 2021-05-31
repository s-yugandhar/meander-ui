import {
   LOGIN_SUCCESS,
   LOGOUT_SUCCESS,
   PAGE,
   FOLDER_CREATED,
   FILE_UPLOADED,
   FOLDER_NAME ,
   FOLDER_LIST ,
   DBFOLDER_LIST,
   FILE_LIST,
   UPPY_SUCCESS,
   UPPY_FAILED,
   UPPY_BATCHID ,
   VIDEO_LIST ,
   EDIT_VIDEO,
   USER_OBJ,
   FILTER_TYPE,
   ACCESS_IN,
   ACCESS_OUT,
   ARCHIVE_ACCOUNT,
   PUBLIC_VIDEOS,
   APP_PLANS
} from './types'

const localUserId = localStorage.getItem('userId');
const localToken = localStorage.getItem('token');
const localUserName = localStorage.getItem('userName');
const archive = JSON.parse(localStorage.getItem('archive'));

export const initialState = {
   archiveAccount : archive,
   token: localToken ? localToken : null,
   userId: localUserId ? localUserId : null,
   userName: localUserName ? localUserName : null,
   page: localToken ? 'videos' : 'login',
   folderCreated: null,
   fileUploaded: null,
   folderName: '' ,
   folderList : [],
   dbfolderList : [],
   fileList : [],
   uppySuccess : [],
   uppyFailed : [],
   uppyBatchId : null ,
   videoList : [],
   editVideo : null ,
   filterType : "all",
   accessIn : [] ,
   accessOut : [],
   publicVideos : [],
   appPlans : [] ,
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
      
      case DBFOLDER_LIST:
            return {   ...state,  dbfolderList : action.payload.dbfolderList}

      case FILE_LIST:
         return {   ...state,  fileList : action.payload.fileList}
      
      case UPPY_SUCCESS:
         return {   ...state,  uppySuccess : action.payload.uppySuccess}

      case UPPY_FAILED:
         return {   ...state,  uppyFailed : action.payload.uppyFailed}

      case UPPY_BATCHID:
         return {  ...state,  uppyBatchId: action.payload.uppyBatchId}
 
      case VIDEO_LIST :
         return {  ...state,    videoList : action.payload.videoList }

      case EDIT_VIDEO :
         return {  ...state , editVideo : action.payload.editVideo }
 
      case USER_OBJ :
         return { ...state , userObj : action.payload.userObj}
      
      case FILTER_TYPE :
         return { ...state , filterType : action.payload.filterType}
      
      case ACCESS_IN :
         return { ...state , accessIn : action.payload.accessIn }
      
      case ACCESS_OUT :
         return { ...state , accessOut : action.payload.accessOut }

      case ARCHIVE_ACCOUNT : 
      return { ...state , archiveAccount : action.payload.archiveAccount }

      case PUBLIC_VIDEOS : 
      return { ...state , publicVideos : action.payload.publicVideos }

      case APP_PLANS : 
      return { ...state , appPlans : action.payload.appPlans }


      default:
         return state;
   }
}