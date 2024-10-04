export default function App() {
  return (
    <div className="relative">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/space.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="font-sixtyfour text-6xl text-center bg-space-vibe bg-clip-text text-transparent">
          Robo In Space
        </h1>
      </div>
    </div>
  );
}
