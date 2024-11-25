const upload = document.getElementById('upload');
const grayscaleBtn = document.getElementById('grayscale');
const blurBtn = document.getElementById('blur');
const goBackBtn = document.getElementById('goBack');
const downloadBtn = document.getElementById('download');
const originalCanvas = document.getElementById('originalCanvas');
const editedCanvas = document.getElementById('editedCanvas');

const originalCtx = originalCanvas.getContext('2d');
const editedCtx = editedCanvas.getContext('2d');

// Set canvas dimensions
const canvasWidth = 500;
const canvasHeight = 500;
originalCanvas.width = canvasWidth;
originalCanvas.height = canvasHeight;
editedCanvas.width = canvasWidth;
editedCanvas.height = canvasHeight;

let img = new Image();
let history = []; // Stack to store previous states

// Load the uploaded image onto the canvas
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = () => {
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    const newWidth = img.width * scale;
    const newHeight = img.height * scale;
    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = (canvasHeight - newHeight) / 2;

    // Draw the image on both canvases
    originalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    editedCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    originalCtx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    editedCtx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

    history = []; // Clear history
    saveState();
};

// Save the current canvas state
const saveState = () => {
    const currentData = editedCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    history.push(currentData);
};

// Apply grayscale
grayscaleBtn.addEventListener('click', () => {
    saveState();
    const imageData = editedCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
    }

    editedCtx.putImageData(imageData, 0, 0);
});

// Apply blur
blurBtn.addEventListener('click', () => {
    saveState();
    const imageData = editedCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const width = imageData.width;

    const blurKernel = (x, y, data, width) => {
        let r = 0, g = 0, b = 0, count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < width) {
                    const index = (ny * width + nx) * 4;
                    r += data[index]; g += data[index + 1]; b += data[index + 2];
                    count++;
                }
            }
        }
        return [r / count, g / count, b / count];
    };

    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * width + x) * 4;
            const [r, g, b] = blurKernel(x, y, data, width);
            data[index] = r; data[index + 1] = g; data[index + 2] = b;
        }
    }

    editedCtx.putImageData(imageData, 0, 0);
});

// Undo changes
goBackBtn.addEventListener('click', () => {
    if (history.length > 1) {
        history.pop();
        editedCtx.putImageData(history[history.length - 1], 0, 0);
    } else {
        alert("No more steps to undo!");
    }
});

// Download the edited image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = editedCanvas.toDataURL("image/png");
    link.download = 'edited-image.png';
    link.click();
});
