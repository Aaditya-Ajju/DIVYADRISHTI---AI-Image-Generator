const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const Genbtn = document.getElementById("btn");
const downloadBtn = document.getElementById("download");
const resetBtn = document.getElementById("reset");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");

let objectUrl = "";

// Function to query the Hugging Face API
async function query() {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({ inputs: inputText.value }),
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.blob();
    image.style.display = "block"; // Show the generated image
    load.style.display = "none";  // Hide loading
    return result;
}

// Generate the image
async function generate() {
    load.style.display = "block"; // Show loading spinner
    try {
        query().then((response) => {
            objectUrl = URL.createObjectURL(response);  // Store URL for download
            image.src = objectUrl;  // Set the generated image
        });
    } catch (error) {
        console.error("Error generating image:", error);
    }
}

// Download the image
downloadBtn.addEventListener("click", () => {
    if (objectUrl) {
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "generated_image.png";  // Specify the file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("No image to download!");
    }
});

// Reset the image and input field
resetBtn.addEventListener("click", () => {
    image.style.display = "none";  // Hide the image element
    image.src = "";  // Clear the image
    inputText.value = "";  // Clear the input field
    objectUrl = "";  // Clear the object URL
    svg.style.display = "block";  // Show the default SVG again if needed
});
// Event listener for 'Enter' key to trigger generation
inputText.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        generate();
        svg.style.display="none"
    }
});

// Button click event to trigger image generation
Genbtn.addEventListener("click", () => {
    generate();
    
    svg.style.display="none"
});
