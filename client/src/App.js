import {useState,useEffect} from 'react';
import './App.css';
import abi from "./contracts/DAROSmartContract.json";
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero1';
import DataSection from './components/DataSection';
import Footer from './components/Footer';
import NewPublication from './components/newPublication';
import FileSubmit from "./components/FileSubmit";
import PublicationPage from './components/PublicationPage';
import Publication01 from "./components/Publication01";
import Profile from './components/Profile';
import { ethers } from "ethers";

function App() {

  const [state,setState] = useState({
    provider:null,
    signer:null,
    contract:null,
  })

  const [account,setAccount] = useState('None');
  const [id,setId]=useState(1);

  useEffect(()=>{
    const connectWallet=async()=>{
      const contractAddress = "0xb255Bc85069bDe14D66333Abb89ab7a226F39D39";
      // const contractAddress = "0x1E066480866E5588a38d7749d17D098A187B2f1b";
      const contractABI=abi.abi;
      try{
        const {ethereum}=window;
        if(ethereum){
          const accounts=await ethereum.request({method:"eth_requestAccounts"});

          window.ethereum.on("chainChanged",()=>{
            window.location.reload();
          })

          window.ethereum.on("accountsChanged",()=>{
            window.location.reload();
            connectWallet();
          })
        
          const provider=new ethers.providers.Web3Provider(window.ethereum);
          const signer=provider.getSigner();
          const contract=new ethers.Contract(contractAddress,contractABI,signer);
          console.log(accounts[0]);
          setAccount(accounts[0]);
          setState({provider,signer,contract});
          console.log(state);
        }else{
          alert("please install metamask")
        }
      }
      catch{
        console.log("error");
      }
    };
    connectWallet();
  },[])
  console.log(state);

  function setIdfunc(_id){
    setId(_id);
  }



  return (
    
    <div className="App">
      
      {/* <Hero /> */}
      {/* <DataSection /> */}
      {/* <NewPublication state={state}/> */}
      {/* <FileSubmit /> */}
      {/* <PublicationPage state={state} setId={setIdfunc}/> */}
      {/* <Profile state={state} account={account}/> */}
      {/* <Publication01 state={state} id={id}/> */}
      
      
      <Router>
      <Navbar state={state} account={account}/>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/publications" element={<PublicationPage state={state} setid={setIdfunc}/>} />
          <Route path="/profile" element={<Profile state={state} account={account} setid={setIdfunc}/>}/>
          <Route path="/pub01" element={<Publication01 state={state} id={id}/>} />
          <Route path="/publish" element={<NewPublication state={state}/>} />
          
        </Routes>
        <Footer />
      </Router>
      

    </div>
  );
}

export default App;