const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
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

export default Spinner;
