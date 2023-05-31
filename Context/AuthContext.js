import React, {createContext, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import zxcvbn from 'zxcvbn';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [snackMessage,setSnackMessage] =useState("");
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  async function loginWithEmailPassword(email, password, navigation) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;
      setUser(user);
      console.log(`Logged in as ${user.email}`);
      return user
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async function SignUpWithEmailPassword(email, password, navigation) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;
      await user.sendEmailVerification();
      setUser(user);
      console.log(`Logged in as ${user.email}`);
     
    } catch (error) {
      return error;
    }
  }
  async function signInGoogle(navigation) {
    GoogleSignin.configure({
      webClientId:
        '789085115298-qgs1agsbe8pqcmh11ttoqfnqrtsirn9g.apps.googleusercontent.com',
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //console.log(userInfo)
      setUser({
      email:  userInfo.user.email,
      photo :  userInfo.user.photo
      }
      );
      return user
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error);
      } else {
        // some other error happened
        console.log(error);
      }
    }
  }
  async function signInWithFacebook(navigation) {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    try {
      const {user} = await auth().signInWithCredential(facebookCredential);
      setUser(user);
      console.log(`Logged in as ${user.displayName}`);
    
    } catch (error) {
      console.log(error);
      return error
     
    }
    
  }
  const handleLogout = async () => {
    try {
     
      const type = await AsyncStorage.getItem("type")
      console.log(type)
      if(type=="go")
      {
        console.log(type)
       await GoogleSignin.signOut();
       await AsyncStorage.removeItem("user")
       await AsyncStorage.removeItem("type");
       console.log('User logged out successfully');
      }else{
        await auth().signOut();
        console.log('User logged out successfully');
         await AsyncStorage.removeItem("user")
         await AsyncStorage.removeItem("type");
      }
     
      // Add any additional logic or navigation here after logout
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };
  const updateEmail =async (newEmail,newPassword) => {
    const user = auth().currentUser;

    if (!user) {
      console.log('No user currently signed in.');
      // Handle the case where no user is signed in
    } else {
      // Update the password
      user.updatePassword(newPassword)
        .then(() => {
          console.log('Password updated successfully.');
    
          // Re-authenticate the user with the new password
          const credential = auth.EmailAuthProvider.credential(user.email, newPassword);
          user.reauthenticateWithCredential(credential)
            .then(() => {
              console.log('User reauthenticated successfully.');
    
              // Update the email after the password is updated and user is reauthenticated
              user.updateEmail(newEmail)
                .then(async() => {
                  console.log('Email updated successfully.');
                }).then(async()=>{
                  await user.sendEmailVerification();
                  console.log("send");
                })
                .catch((error) => {
                  console.log('Error updating email:', error);
                });
            })
            .catch((error) => {
              console.log('Error reauthenticating user:', error);
            });
        })
        .catch((error) => {
          console.log('Error updating password:', error);
        });
    }
    
  };
  const updateEmail2 =async(email)=>
  { 
    const user = auth().currentUser;
    if(!user){
      console.log('No user currently signed in.');
    }else{
      user.updateEmail(email)
      await user.sendEmailVerification();
      console.log('Email updated successfully.');
    }

  }
  async function updateSnackMessage(message)
  { console.log("update pfe");
    try{
      console.log(message)
     setSnackMessage(message)
     
    }catch(err)
    {
      console.log(err)
    }
    console.log(snackMessage)
  }
  
  
  return (
    <AuthContext.Provider
      value={{
        loginWithEmailPassword,
        SignUpWithEmailPassword,
        signInGoogle,
        signInWithFacebook,
        user,
        errorMessage,
        snackMessage,
        updateEmail2,
       updateSnackMessage,
       handleLogout,
       updateEmail,
  
      }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
