import React, { useState, useRef } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';

interface EllipseConfig {
  color: string;
  fx: number;
  scale: [number, number];
  skew: number;
  rotation: number;
  translation: [number, number];
}

const colorPalettes = {
  'OpenAI (2020)': ['#5135FF', '#FF5828', '#F69CFF', '#FFA50F'],
  'venki.dev #1': ['#FE69B7', '#BC0A6F', '#00F5FF', '#7B68EE'],
  'venki.dev #2': ['#FE69B7', '#BC0A6F', '#E6E6FA', '#6495ED']
};

function generateRandomEllipse(palette: string[]): EllipseConfig {
  return {
    color: palette[Math.floor(Math.random() * palette.length)],
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

function generateSVG(palette: string[]): string {
  const ellipses = Array.from({ length: 12 }, () => generateRandomEllipse(palette));

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
  const [selectedPalette, setSelectedPalette] = useState('OpenAI (2020)');
  const [svgContent, setSvgContent] = useState(() => generateSVG(colorPalettes['OpenAI (2020)']));
  const svgRef = useRef<HTMLDivElement>(null);

  const handleRegenerate = () => {
    setSvgContent(generateSVG(colorPalettes[selectedPalette as keyof typeof colorPalettes]));
  };

  const handlePaletteChange = (palette: string) => {
    setSelectedPalette(palette);
    setSvgContent(generateSVG(colorPalettes[palette as keyof typeof colorPalettes]));
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Pane - Sidebar */}
          <Card className="p-4 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="palette-select">Color Palette</Label>
              <Select value={selectedPalette} onValueChange={handlePaletteChange}>
                <SelectTrigger id="palette-select">
                  <SelectValue placeholder="Select a color palette" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(colorPalettes).map((palette) => (
                    <SelectItem key={palette} value={palette}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {colorPalettes[palette as keyof typeof colorPalettes].map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span>{palette}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
          
          {/* Right Pane - Preview and Controls */}
          <Card className="p-6 space-y-6">
            <div
              ref={svgRef}
              className="flex justify-center bg-white rounded-lg border p-4"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex gap-3 justify-center sm:order-2">
                <Button onClick={handleDownloadSVG} variant="outline" className="flex-1 max-w-xs">
                  Download SVG
                </Button>
                <Button onClick={handleDownloadPNG} variant="outline" className="flex-1 max-w-xs">
                  Download PNG
                </Button>
              </div>
              <Button onClick={handleRegenerate} className="flex-1 max-w-xs sm:order-1">
                Regenerate
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Inspired by & reverse-engineered from{' '}
            <a 
              href="https://justinjay.wang/methods-for-random-gradients/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Justin Jay Wang's blog post
            </a>
            . View source & read more on{' '}
            <a 
              href="https://github.com/venkr/gradient-gen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}