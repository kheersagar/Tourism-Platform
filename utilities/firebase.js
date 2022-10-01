// import {initializeApp} from 'firebase/app';
// import {getStorage} from 'firebase/storage';
//
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagindsenderId: process.env.MESSAGING_SENDER_ID,
//   appId:process.env.APP_ID
// }
//
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app, process.env.BUCKET_URL);
//
// export default storage;

import firebaseAdmin from 'firebase-admin';
import {v4 as uuidv4} from 'uuid';
import serviceAccount from '../cg-tourism-86003-firebase-adminsdk-k21ht-53dbe74ddf.json'assert { type: "json" };

var admin = firebaseAdmin.initializeApp({
  credential : firebaseAdmin.credential.cert(serviceAccount),
});

var storageRef = admin.storage().bucket('gs://cg-tourism-86003.appspot.com');

async function uploadFile(path,filename){
  const strg = await storageRef.upload(path,{
    public:true,
    destination: '/uploads/images/'+filename,
    metadata:{
      firebaseStorageDownloadTokens: uuidv4(),
    }
  });
  console.log(strg[0].metadata.mediaLink);
}

// (async()=>{
//   await uploadFile('./unzip_here/images/MicrosoftTeams-image.png','newupload.png');
// })();

export default uploadFile;
