// Import React and necessary hooks
import { useState, useRef, useEffect } from 'react'
// Import QRCode component from the library
import QRCode from 'react-qr-code'
// Import CSS styles
import './App.css'

// Define our main App component
function App() {
  // useState Hook: Manages state variables
  const [url, setUrl] = useState('') // State for URL input
  const [qrValue, setQrValue] = useState('') // State for final QR code value
  const [showQR, setShowQR] = useState(false) // State to control QR code visibility
  const [qrSize, setQrSize] = useState(256) // State for QR code size
  const [isMobile, setIsMobile] = useState(false) // State to track mobile device
  
  // useRef Hook: Creates a reference to DOM elements
  const qrRef = useRef(null)

  // useEffect Hook: Handles side effects (runs after render)
  useEffect(() => {
    // Function to check screen size and adjust settings
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setQrSize(mobile ? 200 : 256)
    }

    // Call immediately to set initial size
    checkScreenSize()
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup function: runs when component unmounts
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, []) // Empty dependency array means this runs only once on component mount

  // Function to generate QR code
  const generateQR = () => {
    // Check if URL input is not empty (trim removes whitespace)
    if (url.trim()) {
      let finalUrl = url.trim()
      
      // Add https:// if no protocol is specified
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl
      }
      
      // Update state with final URL and show QR code
      setQrValue(finalUrl)
      setShowQR(true)
    }
  }

  // Function to download QR code as PNG image
  const downloadQR = () => {
    // Check if our ref exists and QR code is rendered
    if (qrRef.current) {
      // Find the canvas element inside QR code container
      const canvas = qrRef.current.querySelector('canvas')
      
      if (canvas) {
        // Convert canvas to PNG data URL
        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')
        
        // Create temporary download link
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = 'qrcode.png' // Set filename
        
        // Add to DOM, click, and remove
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
  }

  // Function to reset the form and generate new QR code
  const resetQR = () => {
    setUrl('') // Clear URL input
    setQrValue('') // Clear QR value
    setShowQR(false) // Hide QR code section
  }

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQR()
    }
  }

  // Function for quick example buttons
  const quickExample = (exampleUrl) => {
    setUrl(exampleUrl)
    // Auto-generate on mobile for better user experience
    if (isMobile) {
      setTimeout(() => generateQR(), 100)
    }
  }

  // JSX Return - what gets rendered to the screen
  return (
    // Main app container
    <div className="App">
      
      {/* Content container with styling */}
      <div className="container">
        {/* Header section */}
<header className="app-header">
  {/* Add this logo section */}
  <div className="logo">
    <div className = "logo-icon"><img src="/QRLogo.png" alt="QR Logo" /></div>
   
    <div className="logo-text"><h3>QR CODE GENERATOR</h3></div>
  </div>
  
  {/* <h1>QR Code Generator</h1> */}
  <p className="subtitle">Convert any URL into a scannable QR code</p>
  {/* {isMobile && (
    <div className="mobile-indicator">
      📱 Mobile Mode
    </div>
  )} */}
</header>

        {/* Input section */}
        <div className="input-section">
          <div className="input-group">
            {/* URL input field - controlled component */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your URL (e.g., google.com or https://example.com)"
              className="url-input"
            />

            {/* Generate button - disabled when URL is empty */}
            <button
              onClick={generateQR}
              disabled={!url.trim()}
              className="generate-btn"
            >
              {/* Conditional button text based on device */}
              {isMobile ? "Generate" : "Generate QR Code"}
            </button>
          </div>

          {/* Example URLs section - only show when QR code isn't displayed */}
          {!showQR && (
            <div className="examples">
              <p>Try these examples:</p>
              <div className="example-links">
                {/* Quick example buttons */}
                <button onClick={() => quickExample("google.com")}>
                  google.com
                </button>
                <button onClick={() => quickExample("https://github.com")}>
                  github.com
                </button>
                <button onClick={() => quickExample("https://youtube.com")}>
                  youtube.com
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QR Code section - conditionally rendered */}
        {showQR && (
          <div className="qr-section" ref={qrRef}>
            {/* QR code container */}
            <div className="qr-container">
              <div style={{ background: "#fff", padding: "16px" }}>
                <QRCode value={qrValue} size={qrSize} />
              </div>
            </div>

            {/* QR code information */}
            <div className="qr-info">
              <p className="qr-url">
                <strong>URL:</strong>
                <a href={qrValue} target="_blank" rel="noopener noreferrer">
                  {/* Truncate long URLs on mobile */}
                  {isMobile && qrValue.length > 40
                    ? `${qrValue.substring(0, 37)}...`
                    : qrValue}
                </a>
              </p>

              <p className="scan-instruction">
                {isMobile
                  ? "Open your camera and scan this QR code"
                  : "Scan this QR code with your phone's camera to visit the website"}
              </p>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              <button onClick={downloadQR} className="download-btn">
                {isMobile ? "Download" : "Download QR Code"}
              </button>
              <button onClick={resetQR} className="reset-btn">
                {isMobile ? "New QR" : "Generate Another"}
              </button>
            </div>
          </div>
        )}

        {/* Instructions section */}
        {showQR && (
          <div className="features">
            <h3>How to use:</h3>
            <ul>
              <li>
                📱{" "}
                {isMobile
                  ? "Open your camera app"
                  : "Open your phone's camera app"}
              </li>
              <li>🔍 Point it at the QR code above</li>
              <li>🌐 Tap the notification to open the link</li>
              <li>💾 Download the QR code to share with others</li>
            </ul>
          </div>
        )}

        {/* Mobile Floating Action Button */}
        {/* {isMobile && !showQR && url.trim() && (
          <div className="mobile-fab">
            <button onClick={generateQR} className="fab-btn">
              Generate QR
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App