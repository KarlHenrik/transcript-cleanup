import React from "react";
import "./DownloadButton.css"

function DownloadButton(props) {
    function handleDownload() {
        //var link = document.createElement('a');
        //link.download = 'data.txt';
        //var blob = new Blob(["placeholder"], {type: 'text/plain'});
        //link.href = window.URL.createObjectURL(blob);
        //link.click();
    }
    if (props.contents) {
        return <button onClick={handleDownload} className="DownloadButton">Download file</button>
    } else {
        return null
    }
}

export default DownloadButton;