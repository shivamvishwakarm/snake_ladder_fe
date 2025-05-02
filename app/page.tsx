import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[80vh] flex flex flex-col items-center justify-center">
      <div className="text-white flex flex-col  gap-4 border border-gray-600 p-10 rounded-md shadow-md shadow-gray-600  ">
        <Link
          className="px-4 py-2 bg-gray-500 text-black rounded-md"
          href="/bot">
          Play with bot
        </Link>
        <Link
          className="px-4 py-2 bg-gray-500 text-black rounded-md"
          href="/friends">
          Play with player
        </Link>
      </div>
    </div>
  );
}
