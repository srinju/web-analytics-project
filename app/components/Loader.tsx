

export default function Loader() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-full h-full border-4 border-red-500 rounded-full animate-ping delay-200"></div>
          <div className="absolute inset-0 w-full h-full border-4 border-green-500 rounded-full animate-ping delay-400"></div>
          <div className="absolute inset-0 w-full h-full border-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 bg-black border-4 border-white rounded-full"></div>
        </div>
      </div>
    );
  }