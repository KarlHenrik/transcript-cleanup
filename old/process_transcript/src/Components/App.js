import './App.css';
import React, { useState } from "react";



function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    file.text()
    .then((text) => {
      console.log(text);
    });
    /*
    const element = document.createElement("a");
    //const file = new Blob([file], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    */
  }
  
  return (
    <div>
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>

      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      

      {file && <button onClick={handleDownload}>Download a file</button>}
    </div>
  );
};

export default App;
