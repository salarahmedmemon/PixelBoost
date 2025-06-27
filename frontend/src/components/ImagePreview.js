export const ImagePreview = ({ title, image }) => (
  <div className="flex flex-col bg-white items-center mt-6">
    <h2 className="text-lg font-semibold mb-2 mt-3">{title}</h2>
    {image && <img src={image} alt={title} className="max-w-xs mb-5 rounded-lg" />}
  </div>
);