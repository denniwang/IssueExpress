interface HangingHeaderProps {
  title: string;
  ropeColor: string;
  circleColor: string;
}

export default function HangingHeader({
  title,
  ropeColor,
  circleColor,
}: HangingHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 flex justify-center w-full">
        <div className={`w-[3px] h-16 ${ropeColor} mx-32 relative`}>
          <div
            className={`w-4 h-4 ${circleColor} rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`}
          />
        </div>
        <div className={`w-[3px] h-16 ${ropeColor} mx-32 relative`}>
          <div
            className={`w-4 h-4 ${circleColor} rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`}
          />
        </div>
      </div>
      <div className="bg-[#145D98] px-16 py-4 mt-16 shadow-lg">
        <h1 className="text-3xl font-retro text-white tracking-[0.2em]">
          {title}
        </h1>
      </div>
    </div>
  );
}
