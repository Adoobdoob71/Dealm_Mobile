import * as Firebase from 'firebase';

async function loginWithEmailAndPassword(email : string, password : string){
  try {
    let result : Firebase.default.auth.UserCredential = await Firebase.default.auth().signInWithEmailAndPassword(email, password);
    return result;
  }catch(error) {
    return error;
  }
}

function goToRegister(){
  
}

export {
  loginWithEmailAndPassword,

}