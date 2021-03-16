import {
   LOGIN_SUCCESS,
   LOGOUT_SUCCESS,
   PAGE,
   FOLDER_CREATED,
   FILE_UPLOADED
} from './types'


export const initialState = {
   token: null,
   userId: null,
   userName: null,
   page: 'login',
   folderCreated: null,
   fileUploaded: null,
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
            fileUploaded: action.payload.fileUploaded
         }

      default:
         return state;
   }
}