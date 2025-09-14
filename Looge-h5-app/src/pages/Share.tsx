import React from 'react';

const Share: React.FC = () => {
    const generateShareLink = () => {
        // Logic to generate share link
    };

    const generateQRCode = () => {
        // Logic to generate QR code
    };

    return (
        <div>
            <h1>分享链接</h1>
            <button onClick={generateShareLink}>生成分享链接</button>
            <div>
                <h2>二维码</h2>
                <div id="qrcode" />
                <button onClick={generateQRCode}>生成二维码</button>
            </div>
        </div>
    );
};

export default Share;