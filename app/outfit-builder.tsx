"use client";
import { useState, useRef } from 'react';
import './globals.css'; 

type ClothingItem = {
  id: string;
  name: string;
  type: string;
};

export default function OutfitBuilder() {
  const [outfitItems, setOutfitItems] = useState<{
    id: string;
    item: ClothingItem;
    position: { x: number; y: number };
  }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const clothingItems: ClothingItem[] = [
    { id: '1', name: 'T-Shirt', type: 'top' },
    { id: '2', name: 'Shorts', type: 'bottom' },
    { id: '3', name: 'Jacket', type: 'outerwear' },
    { id: '4', name: 'Dress', type: 'dress' },
    { id: '5', name: 'Hat', type: 'hat' },
    { id: '6', name: 'Shoes', type: 'shoes' },
  ];

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    const item = JSON.parse(data) as ClothingItem;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setOutfitItems((prev) => [
      ...prev,
      {
        id: `${item.id}-${Date.now()}`,
        item,
        position: { x, y },
      },
    ]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetOutfit = () => {
    setOutfitItems([]);
  };

  return (
    <div className="outfit-builder-container">
      <h1 className="text-4xl font-bold text-center mb-8">Outfit Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Clothing Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Clothing Items</h2>
          <div className="grid grid-cols-1 gap-4">
            {clothingItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="clothing-item"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <span className="ml-4 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Canvas Area</h2>
          <div
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="canvas-area"
          >
            {outfitItems.length === 0 && (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400">
                Drag items here
              </p>
            )}
            {outfitItems.map((outfitItem) => (
              <div
                key={outfitItem.id}
                className="canvas-item"
                style={{
                  left: `${outfitItem.position.x}px`,
                  top: `${outfitItem.position.y}px`,
                }}
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <span className="text-xs block text-center">{outfitItem.item.name}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={resetOutfit}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}