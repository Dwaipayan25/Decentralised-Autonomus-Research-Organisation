import React, { useState, useReducer } from 'react';
import { Web3Storage } from 'web3.storage';
import { ethers } from "ethers";
import "./newPublication.css"

const Form = ({state}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setfiles] = useState(null);
  const [messages, showMessage] = useReducer((msgs, m) => msgs.concat(m), [])
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM2QTg4NWFFNjRBRGVhZjRBQmY1NTljMDM0RTk1MjA0YWYyNjBFQjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQ2OTg4ODg0MzgsIm5hbWUiOiJEQVJPMDEifQ.vTYgJRu6tOkKF-jIBPN1kWCzJ5h4ESesqLV_wmOATEc"
//   const [files, setFiles] = useState([])

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setfiles(e.target.files[0]);
  };

  const changeToInt=(_x)=>{
    const x= ethers.utils.formatEther(_x)*(10**18);
    return x;
}

  async function seePub(e){
    e.preventDefault();
    const { contract } = state;
    const l=await contract.publicationCounter.call();
    console.log(l);
    const ll=changeToInt(l);
    console.log(l);
    for(let i=1;i<=ll;i++){
        const data=await contract.publications(i);
        console.log(data);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { contract } = state;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    console.log(title,description);

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
    const tx=await contract.addPublication(title,description,hash);
    await tx.wait();
    console.log("Publication Created");
    alert("Publication created");
    setTitle('');
    setDescription('');
    setfiles(null);
  }

  function showLink(url) {
    showMessage(<span>&gt; 🔗 <a href={url}>{url}</a></span>);
  }
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    console.log(data);

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setfiles(e.target.files[0]);
    };
    // setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div>
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={handleDescriptionChange}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor='fileupload'>Pick files to upload</label>
        <input type='file' id='file-upload' name='data' onChange={e => setfiles(e.target.files)} multiple required />
        {/* <input className='upbtn' type='submit' value='Upload' id='submit' /> */}
      </div>
      <button type="submit">Submit</button>
    </form>
    {/* <button onClick={seePub}>See Pubs</button> */}
    </div>
  );
};

export default Form;
