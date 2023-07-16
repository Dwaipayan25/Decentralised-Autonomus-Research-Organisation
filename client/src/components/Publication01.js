import React from 'react'
import { ethers } from "ethers";
import { useState,useEffect,useReducer } from "react";
import './Publication01.css'; // CSS file for styling
import PubCard from "./PubCard";
import UpdateCard from "./UpdateCard";
import { Web3Storage } from 'web3.storage';

export const shortenAddress = (address) => {
    return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
    )}`;
}
const changeToInt=(_x)=>{
    const x= ethers.utils.formatEther(_x)*(10**18);
    return x;
}


const PublicationPage = ({state,id}) => {
    
    const {contract}=state;
    const [publication,setPublication]=useState([]);
    const [updates,setUpdates]=useState([]);
    const [description, setDescription] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [files, setfiles] = useState(null);
    const [messages, showMessage] = useReducer((msgs, m) => msgs.concat(m), []);
    const [totalContributions, setTotalContributions]=useState(0);
    const [eth, setEth] = useState(0);
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM2QTg4NWFFNjRBRGVhZjRBQmY1NTljMDM0RTk1MjA0YWYyNjBFQjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQ2OTg4ODg0MzgsIm5hbWUiOiJEQVJPMDEifQ.vTYgJRu6tOkKF-jIBPN1kWCzJ5h4ESesqLV_wmOATEc";

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleUpdateDescription = (e) => {
        setUpdateDescription(e.target.value);
    };

    const handleEthChange = (e) => {
        setEth(e.target.value);
    };

    const handleFileChange = (e) => {
        setfiles(e.target.files[0]);
    };
    
    useEffect(()=>{
        const getPublication=async()=>{
            // e.preventDefault();
            const {contract}=state;
            const publication=await contract.getPublicationById(id);
            setPublication(publication);
            console.log(publication);
            const updates=await contract.getUserUpdates(id);
            setUpdates(updates);
            console.log(updates);
            const totalContributions=ethers.utils.formatEther(publication.totalContributions)*(10**18);
            setTotalContributions(totalContributions);
        }
        contract && getPublication();
    },[contract]);

    const contributeRequest=async()=>{
        console.log(id,description);
        const tx=await contract.contribute(id,description);
        await tx.wait();
        alert("Request Sent");
    }
    const DistributePublication=async()=>{
        const tx=await contract.distributeFunds(id);
        await tx.wait();
        alert("Fund Distributed");
    }

    const Donate=async()=>{
        const val=eth*(10**18);
        console.log(val);
        const v=(String)(val);
        console.log(v);
        const tx=await contract.contributeFunds(id,{value:v});
        await tx.wait();
        alert("Donated");
    }

    const updatePublication=async(e)=>{
        e.preventDefault();
        const { contract } = state;
        const updateDes=updateDescription;
        let hash="";
        if(files){
            console.log(files);
            const client = new Web3Storage({ token });
            const cid = await client.put(files, {
                onRootCidReady: localCid => {
                  showMessage(`> 🔑 locally calculated Content ID: ${localCid} `)
                  showMessage('> 📡 sending files to web3.storage ')
                },
                onStoredChunk: bytes => showMessage(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
            })
            hash=`https://dweb.link/ipfs/${cid}`;
            alert("Successfully uploaded image");
        }
        console.log(hash);
        const tx=await contract.updatePublications(id,hash,updateDes);
        await tx.wait();
        alert("Updated");
        setfiles(null);
    }
    



  return (
    <div className="publication-page">
      <div className="top-section">
        <div className="update-publication">
          <h2>Update Publication</h2>
          {/* <label htmlFor='fileupload'>Pick files to upload</label> */}
          <label htmlFor='input'>Update Publication</label>
          <input
            type="text"
            placeholder="Description"
            value={updateDescription}
            onChange={handleUpdateDescription}
          />
            <input type='file' id='file-upload' name='data' onChange={e => setfiles(e.target.files)} multiple required />
          <button onClick={updatePublication}>Update</button>
        </div>
        <div className="allow-access">
          <h2>Request Access to Contribute</h2>
          <label htmlFor='input'>Why you want to contribute ?</label>
          <p>Give reasons!</p>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <button onClick={contributeRequest}>Request Access</button>
        </div>
      </div>
      <div className="top-section">
        
        <div className="update-publication">
          <h2>Distribute Funds</h2>
          <h3>Total Contributions: {totalContributions}</h3>
          <p>Only Owner can distribute funds.</p>
          <p>Owner:70% , Rest Contributor:30%</p>
          <button onClick={DistributePublication}>Distribute</button>
        </div>

        <div className="allow-access">
          <h2>Fund Publication</h2>
          <label htmlFor='input'>How much to contribute ?</label>
          <p>(Crosschain Funding possible by AXELAR)</p>
          <p>Enter Funding value in (tFIL)</p>
          <input
          type="number"
          step="0.01"
          placeholder="Donate"
          value={eth}
          onChange={handleEthChange}
            />
          <button onClick={Donate}>Fund</button>
        </div>
      </div>
      <h1>{publication.title}</h1>
      <div className="publication-details">
        <PubCard
            address={publication.researcher}
            description={publication.description}
            fileLink={publication.hash}
            // time={changeToInt(publication.timestamp)}
         />
        <div className="other-files">
          <h3>Updates</h3>
          <ul>
            {updates.map((update,index)=>(
                <UpdateCard
                    key={index}
                    address={update.userAddress}
                    description={update.description}
                    fileLink={update.data}
                 />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublicationPage;