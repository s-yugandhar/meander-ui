import React from 'react';


const CaptureScreenshot = props => {
    const {
    captured, resetCapture, videoWidth, videoHeight
    } = props;
    
    const canvasStyle = {
    position: 'absolute',
    visibilit: 'hidden'
    };
    
    if (captured) {
    const video = document.querySelector('video');
    const canvas = document.querySelector('#screenshot_canvas');
    if (video && canvas) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, videoWidth, videoHeight);
    context.drawImage(video, 0, 0, videoWidth, videoHeight); 
    const img = document.createElement('img');
    img.setAttribute('crossOrigin', 'anonymous');
    img.setAttribute('src', canvas.toDataURL());

  const link = document.createElement('a');
  link.download = 'Download.png';
  link.href = img.src;
  link.click();
  link.remove();
  img.remove();
}

}


    return (
        <>
        <canvas id="screenshot_canvas" style={canvasStyle} />
        </>
        );
        };

        export default CaptureScreenshot;