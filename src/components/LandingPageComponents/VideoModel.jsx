import { IoMdClose } from "react-icons/io";

const VideoModel = ({ setShowVideo }) => {
  return (
    <div className="fixed top-0 inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
      <iframe
        className="rounded-xl"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/d9mWh03Z0SA?si=IXB0t4vXtLZSjQ8X"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <button
        onClick={() => setShowVideo(false)}
        className="text-primary absolute top-4 right-4 bg-background p-2 rounded-full "
      >
        <IoMdClose size={32} />
      </button>
    </div>
  );
};
export default VideoModel;
