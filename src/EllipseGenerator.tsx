import React, { useState, useRef } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

interface EllipseConfig {
  color: string;
  fx: number;
  scale: [number, number];
  skew: number;
  rotation: number;
  translation: [number, number];
}

const colors = ['#5135FF', '#FF5828', '#F69CFF', '#FFA50F'];

function generateRandomEllipse(): EllipseConfig {
  return {
    color: colors[Math.floor(Math.random() * colors.length)],
    fx: 0.1 + Math.random() * 0.3,
    scale: [0.7 + Math.random() * 0.8, 0.7 + Math.random() * 0.8],
    skew: -10 + Math.random() * 20,
    rotation: Math.random() * 360,
    translation: [
      -250 + Math.random() * 500,
      -250 + Math.random() * 500
    ]
  };
}

function generateSVG(): string {
  const ellipses = Array.from({ length: 12 }, generateRandomEllipse);

  const gradients = ellipses.map((ellipse, index) => {
    return `<radialGradient id="grad${index}" fx="${ellipse.fx}" fy="0.5">
    <stop offset="0%" stop-color="${ellipse.color}"/>
    <stop offset="100%" stop-color="${ellipse.color}" stop-opacity="0"/>
  </radialGradient>`;
  }).join('');

  const rects = ellipses.map((ellipse, index) => {
    return `<rect x="0" y="0" width="100%" height="100%" fill="url(#grad${index})" transform="translate(300 300) scale(${ellipse.scale[0]} ${ellipse.scale[1]}) skewX(${ellipse.skew}) rotate(${ellipse.rotation}) translate(${ellipse.translation[0]} ${ellipse.translation[1]}) translate(-300 -300)"/>`;
  }).join('');

  return `<svg width="600" height="400" viewBox="0 0 600 600" style="width:100%;max-width:600px;height:auto;filter:saturate(125%);-webkit-filter:saturate(125%)" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradients}
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="#5135FF"/>
  ${rects}
</svg>`;
}

export default function EllipseGenerator() {
  const [svgContent, setSvgContent] = useState(() => generateSVG());
  const svgRef = useRef<HTMLDivElement>(null);

  const handleRegenerate = () => {
    setSvgContent(generateSVG());
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ellipses-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 6000;
    canvas.height = 4000;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ellipses-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };

    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ellipse Generator</h1>
          <p className="text-gray-600">Generate beautiful gradient ellipse patterns</p>
        </div>

        <div
          ref={svgRef}
          className="flex justify-center bg-white rounded-lg border p-4"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        <div className="flex gap-3 justify-center">
          <Button onClick={handleRegenerate} className="flex-1 max-w-xs">
            Regenerate
          </Button>
          <Button onClick={handleDownloadSVG} variant="outline" className="flex-1 max-w-xs">
            Download SVG
          </Button>
          <Button onClick={handleDownloadPNG} variant="outline" className="flex-1 max-w-xs">
            Download PNG
          </Button>
        </div>
      </Card>
    </div>
  );
}