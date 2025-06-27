import { useState } from 'react';

export const ImageUpload = ({ onImageSelect }) => {

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const url = URL.createObjectURL(file);
        onImageSelect(file, url);
        }
    };

    return (
        <div className="flex justify-center mt-6 text-white">
        <input 
            className='border-1 border-zinc-700 px-3 py-2'
            type="file" 
            accept="image/*" 
            onChange={handleChange} 
        />
        </div>
    );
};