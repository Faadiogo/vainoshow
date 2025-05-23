
import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeProps {
  value: string;
  size?: number;
  logoImage?: string;
  bgColor?: string;
  fgColor?: string;
  logoSize?: number;
  logoBackgroundColor?: string;
  qrStyle?: 'squares' | 'dots';
  includeMargin?: boolean;
  ecLevel?: 'L' | 'M' | 'Q' | 'H';
}

// Define the type for QRCodeStyling options
interface QROptions {
  width: number;
  height: number;
  type: 'svg' | 'canvas';
  data: string;
  image?: string;
  margin?: number;
  dotsOptions: {
    color: string;
    type: string;
  };
  backgroundOptions: {
    color: string;
  };
  imageOptions: {
    crossOrigin: string;
    margin: number;
    imageSize: number;
    hideBackgroundDots: boolean;
    backgroundImage?: string;
    backgroundImageAlpha: number;
  };
  qrOptions: {
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  cornersSquareOptions: {
    type: string;
    color: string;
  };
  cornersDotOptions: {
    type: string;
    color: string;
  };
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  logoImage,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  logoSize = 50,
  logoBackgroundColor = '#FFFFFF',
  qrStyle = 'squares',
  includeMargin = true,
  ecLevel = 'H',
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>();

  useEffect(() => {
    if (!qrCode.current) {
      const options: QROptions = {
        width: size,
        height: size,
        type: 'svg',
        data: value,
        image: logoImage,
        margin: includeMargin ? 10 : 0,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'dots' ? 'dots' : 'square'
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 5,
          imageSize: logoSize / size,
          hideBackgroundDots: true,
          backgroundImage: logoImage ? undefined : '',
          backgroundImageAlpha: 1,
        },
        qrOptions: {
          errorCorrectionLevel: ecLevel,
        },
        cornersSquareOptions: {
          type: 'square',
          color: fgColor,
        },
        cornersDotOptions: {
          type: 'square',
          color: fgColor,
        },
      };

      qrCode.current = new QRCodeStyling(options as any);
      
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.current.append(qrRef.current);
      }
    } else {
      qrCode.current.update({
        data: value,
        width: size,
        height: size,
        image: logoImage,
        margin: includeMargin ? 10 : 0,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'dots' ? 'dots' : 'square',
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          imageSize: logoSize / size,
        },
        qrOptions: {
          errorCorrectionLevel: ecLevel,
        },
      });
    }
  }, [value, size, logoImage, bgColor, fgColor, logoSize, qrStyle, includeMargin, ecLevel]);

  return (
    <div className="flex items-center justify-center">
      <div ref={qrRef} />
    </div>
  );
};

export default QRCode;
