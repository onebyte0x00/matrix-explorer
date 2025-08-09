// Global variables
let currentPath = '/';
let pathHistory = [];
let fileSystem = {};

// DOM elements
const fileDisplay = document.getElementById('fileDisplay');
const commandInput = document.querySelector('.command-input');
const pathDisplay = document.querySelector('.path-display');

// Initialize
fetch('data/files.json')
  .then(response => response.json())
  .then(data => {
    fileSystem = data;
    navigateTo(currentPath);
  })
  .catch(error => {
    console.error('Error loading files.json:', error);
    fileDisplay.innerHTML = '<div class="error">Error loading file system</div>';
  });

// Navigation function
function navigateTo(path) {
  const parts = path.split('/').filter(part => part !== '');
  let current = fileSystem;
  
  for (const part of parts) {
    if (part === '') continue;
    const found = current.files.find(item => item.name === part && item.type === 'directory');
    if (found) {
      current = found;
    } else {
      addCommandOutput(`Directory not found: ${part}`);
      return;
    }
  }
  
  currentPath = path;
  pathDisplay.textContent = `root@matrix:${currentPath === '/' ? '~' : currentPath}$`;
  displayFiles(current.files);
  pathHistory.push(currentPath);
}

// Updated displayFiles function
function displayFiles(files) {
  fileDisplay.innerHTML = '';
  
  // Add ".." for parent directory (except root)
  if (currentPath !== '/') {
    const parentItem = document.createElement('div');
    parentItem.className = 'file-item';
    
    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.textContent = '⬆';
    
    const name = document.createElement('span');
    name.textContent = '.. (parent)';
    
    parentItem.appendChild(icon);
    parentItem.appendChild(name);
    
    parentItem.addEventListener('click', () => {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      navigateTo(parentPath);
    });
    
    fileDisplay.appendChild(parentItem);
  }
  
  files.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.textContent = file.type === 'directory' ? '📁' : '📄';
    
    const name = document.createElement('span');
    name.textContent = file.name;
    
    // Add file info (optional)
    const info = document.createElement('span');
    info.className = 'file-info';
    info.textContent = `${file.size} | ${file.modified}`;
    
    fileItem.appendChild(icon);
    fileItem.appendChild(name);
    fileItem.appendChild(info);
    
    if (file.type === 'directory') {
      fileItem.addEventListener('click', () => {
        const newPath = currentPath === '/' ? 
          `/${file.name}` : 
          `${currentPath}/${file.name}`;
        navigateTo(newPath);
      });
    } else {
      fileItem.addEventListener('click', () => {
        addCommandOutput(`Opening file: ${file.name}...`);
        // Add file opening logic here
      });
    }
    
    fileDisplay.appendChild(fileItem);
  });
}

// Update command processing for cd command
function processCommand(command) {
  if (command === 'help' || command === '?') {
    addCommandOutput('Available commands: ls, cd [dir], open [file], clear, help, back');
  } else if (command === 'clear') {
    clearTerminal();
  } else if (command === 'ls') {
    // Already showing current directory contents
  } else if (command.startsWith('cd ')) {
    const dir = command.substring(3).trim();
    if (dir === '..') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      navigateTo(parentPath);
    } else if (dir === '/') {
      navigateTo('/');
    } else {
      const newPath = currentPath === '/' ? 
        `/${dir}` : 
        `${currentPath}/${dir}`;
      navigateTo(newPath);
    }
  } else if (command === 'back') {
    if (pathHistory.length > 1) {
      pathHistory.pop(); // Remove current path
      const prevPath = pathHistory.pop(); // Get previous path
      navigateTo(prevPath);
    }
  } else if (command.startsWith('open ')) {
    const file = command.substring(5);
    addCommandOutput(`Opening file: ${file}...`);
  } else {
    addCommandOutput(`Command not found: ${command}. Type 'help' for available commands.`);
  }
}

// Rest of your existing functions (addCommandOutput, clearTerminal, etc.)

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
