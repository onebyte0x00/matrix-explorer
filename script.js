 
let fileData = {};

// Load the JSON file
fetch('data/files.json')
  .then(response => response.json())
  .then(data => {
    fileData = data;
    displayFiles(fileData.files);
  })
  .catch(error => {
    console.error('Error loading files.json:', error);
    // Fallback to default data
    fileData = {
      path: "/",
      files: [
        {name: "Error loading files", type: "file", size: "-", modified: ""}
      ]
    };
    displayFiles(fileData.files);
  });
// DOM elements
const fileDisplay = document.getElementById('fileDisplay');
const commandInput = document.querySelector('.command-input');

// Initialize
displayFiles(fileData.files);

// Event listeners
commandInput.addEventListener('keydown', handleCommand);

function displayFiles(files) {
    fileDisplay.innerHTML = '';
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const icon = document.createElement('span');
        icon.className = 'file-icon';
        icon.innerHTML = file.type === 'directory' ? '📁' : '📄';
        
        const name = document.createElement('span');
        name.textContent = file.name;
        
        fileItem.appendChild(icon);
        fileItem.appendChild(name);
        
        if (file.type === 'directory') {
            fileItem.addEventListener('click', () => {
                // In a real app, you would navigate to the directory
                commandInput.value = `cd ${file.name}`;
                simulateTyping(`Accessing directory: ${file.name}...`);
            });
        } else {
            fileItem.addEventListener('click', () => {
                commandInput.value = `open ${file.name}`;
                simulateTyping(`Opening file: ${file.name}...`);
            });
        }
        
        fileDisplay.appendChild(fileItem);
    });
}

function handleCommand(e) {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        commandInput.value = '';
        
        if (command) {
            addCommandOutput(`> ${command}`);
            processCommand(command);
        }
    }
}

function processCommand(command) {
    // Simple command processing
    if (command === 'help' || command === '?') {
        addCommandOutput('Available commands: ls, cd [dir], open [file], clear, help');
    } else if (command === 'clear') {
        clearTerminal();
    } else if (command === 'ls') {
        displayFiles(fileData.files);
    } else if (command.startsWith('cd ')) {
        const dir = command.substring(3);
        addCommandOutput(`Changing directory to: ${dir}...`);
        // In a real app, you would change directories here
    } else if (command.startsWith('open ')) {
        const file = command.substring(5);
        addCommandOutput(`Opening file: ${file}...`);
    } else {
        addCommandOutput(`Command not found: ${command}. Type 'help' for available commands.`);
    }
}

function addCommandOutput(text) {
    const output = document.createElement('div');
    output.className = 'command-output';
    output.textContent = text;
    fileDisplay.appendChild(output);
    fileDisplay.scrollTop = fileDisplay.scrollHeight;
}

function clearTerminal() {
    fileDisplay.innerHTML = '';
}

function simulateTyping(text) {
    addCommandOutput(text);
}

// Optional: Add Matrix background effect
function createMatrixBackground() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-bg';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#0f0";
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
}

// Uncomment to enable Matrix background effect
// createMatrixBackground();
