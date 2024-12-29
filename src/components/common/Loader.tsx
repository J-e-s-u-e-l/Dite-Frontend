const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="flex space-x-2">
        <div
          className="w-4 h-4 bg-blue-500 rounded-full animate-waveBounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-4 h-4 bg-blue-500 rounded-full animate-waveBounce"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-4 h-4 bg-blue-500 rounded-full animate-waveBounce"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
