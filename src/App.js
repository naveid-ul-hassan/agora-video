import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import LiveVideoStreaming from './AgoraComponent';


function App() {
  const [isHost , setHost] = useState(true)
  const [uid , setUid] = useState()
  const [start , setStart] = useState(false)
  const [token , setToken] = useState()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`https://admin.esocialmint.com/api/get-agora-token/0/test`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
  
        const data = await response.json();
        setToken(data.token); // Assuming the response contains the token
       console.log("toennenen",data.token)
  
      } catch (error) {
        // setError(error.message);
        console.log("erorssssssssss",error)
      }
    };
  
    fetchToken();
   
  }, []);

  return (
    <div className="App">
      <button onClick={()=>setHost(!isHost)}>
        change host
      </button>
      <input 
      onChange={(e)=> {setUid(e.target.value); } }
      value={uid}
      />
      <button onClick={()=> setStart(true)}>
        start
      </button>
      {
        start && token &&
        <LiveVideoStreaming isHost={isHost} user={"192841gjhfdsa"} setIsHost={setHost} uid={uid} token={token}/>
      } 
      
    </div>
  );
}

export default App;
