let fileInput;

window.onload = function () {
  fileInput = document.getElementById('file-input')

  fileInput.onchange = () => {
    console.log("Hey")
    const reader = new FileReader()
    reader.onload = (e) => console.log('file contents:', e.target.result)
  
    for (let file of fileInput.files) {
      reader.readAsText(file)
    }
    
  }
};

