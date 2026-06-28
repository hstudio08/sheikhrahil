export default function SectionBreak() {
  return (
    <div className="w-full flex justify-center items-center py-16 relative">
      {/* A stylish, glowing line with a shadow */}
      <div className="w-1/2 md:w-1/3 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent shadow-[0_2px_10px_rgba(0,0,0,0.1)]"></div>
      
      {/* Center ornament (optional, adds to the layered effect) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border border-border bg-background shadow-sm"></div>
    </div>
  );
}