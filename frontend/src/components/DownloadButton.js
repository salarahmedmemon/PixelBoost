export const DownloadButton = ({ image }) => {
    return (
        <div className="flex justify-center mt-6 absolute bottom-10 left-10">
            <a 
                href={image} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Open Enhanced Image in New Tab and Download
            </a>
        </div>
    );
};