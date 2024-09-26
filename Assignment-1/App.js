// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Set clear color to white, fully opaque initially
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Function to set color
    function setColor(r, g, b, a = 1.0) {
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // Event listeners for color change buttons
    document.getElementById('color1').addEventListener('click', () => setColor(1.0, 0.866, 0.757));
    document.getElementById('color2').addEventListener('click', () => setColor(1.0, 0.667, 0.667));
    document.getElementById('color3').addEventListener('click', () => setColor(1.0, 0.761, 0.627));
    
    // Reset color
    document.getElementById('reset').addEventListener('click', () => setColor(1.0, 1.0, 1.0));
};