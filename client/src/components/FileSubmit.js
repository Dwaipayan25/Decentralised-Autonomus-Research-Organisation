import React, { useState, useReducer } from 'react'
import { Web3Storage } from 'web3.storage'

export default function Home () {
  const [messages, showMessage] = useReducer((msgs, m) => msgs.concat(m), [])
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM2QTg4NWFFNjRBRGVhZjRBQmY1NTljMDM0RTk1MjA0YWYyNjBFQjIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQ2OTg4ODg0MzgsIm5hbWUiOiJEQVJPMDEifQ.vTYgJRu6tOkKF-jIBPN1kWCzJ5h4ESesqLV_wmOATEc"
  const [files, setFiles] = useState([])

  async function handleSubmit (event) {
    // don't reload the page!
    event.preventDefault()

    showMessage('> 📦 creating web3.storage client')
    const client = new Web3Storage({ token })

    showMessage('> 🤖 chunking and hashing the files (in your browser!) to calculate the Content ID')
    const cid = await client.put(files, {
      onRootCidReady: localCid => {
        showMessage(`> 🔑 locally calculated Content ID: ${localCid} `)
        showMessage('> 📡 sending files to web3.storage ')
      },
      onStoredChunk: bytes => showMessage(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
    })
    showMessage(`> ✅ web3.storage now hosting ${cid}`)
    showLink(`https://dweb.link/ipfs/${cid}`)
  }

  function showLink (url) {
    showMessage(<span>&gt; 🔗 <a href={url}>{url}</a></span>)
  }

  return (
    <>
      <header>
        <h1>⁂
          <span>web3.storage</span>
        </h1>
      </header>
      <form id='upload-form' onSubmit={handleSubmit}>
        <label htmlFor='filepicker'>Pick files to store</label>
        <input type='file' id='filepicker' name='fileList' onChange={e => setFiles(e.target.files)} multiple required />
        <input type='submit' value='Submit' id='submit' />
      </form>
      <div id='output'>
        &gt; ⁂ waiting for form submission...
        {messages.map((m, i) => <div key={m + i}>{m}</div>)}
      </div>
    </>
  )
}