import { useState } from "react";
import "./login.scss";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });


  const [loading , setLoading] = useState(false)
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e)=>{
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target)
    const {email,password} = Object.fromEntries(formData);
    console.log(password);
    try{
      await signInWithEmailAndPassword(auth,email,password)

      toast.success("Welcome :)")

    }

    catch(err){
      console.log(err);
      toast.error(err.message)
    }
    finally{
      setLoading(false)
    }
    
    
  }
  const handleRegister = async (e)=>{
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const {username,email,password} = Object.fromEntries(formData);

    try{

      if (!username || !email || !password){
        toast.warn("Please enter inputs!");
        setLoading(false)
      }
      if (!avatar.file) {
        toast.warn("Please upload an avatar!");
        setLoading(false)  
      }
    }
    catch(err){

      toast.warn(err)
    }
      try{
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return toast.warn("Select another username");
      }
      const res = await createUserWithEmailAndPassword(auth,email,password)
      const imgUrl = await upload(avatar.file)
      
      console.log("worked");
      await setDoc(doc(db,"users",res.user.uid),{
        username:username,
        email:email,
        avatar:imgUrl,
        id:res.user.uid ,
        blocked:[] ,
      });
      await setDoc(doc(db,"userchats",res.user.uid),{
        chats:[],
      });
      toast.success("User sucessfully created!")
    }
    catch(err){
      console.log(err);
      toast.error(err.message)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}> {loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Create An Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"} </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
