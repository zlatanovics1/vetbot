import Image from "next/image";

export default function Header() {
  return (
    <div className="text-2xl mt-3 mx-2 font-semibold flex gap-2 py-1 px-3 items-center rounded-full bg-white border border-gray-200 shadow-sm z-10">
      <Image src="/veterinary.png" alt="VetBot" width={40} height={40} />
      <div className="tracking-wider text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">
        VetBot
      </div>
    </div>
  );
}
