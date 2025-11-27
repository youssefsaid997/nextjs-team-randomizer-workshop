
import TeamRegistration from "./components/TeamRegisteration";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-start mt bg-black font-sans p-4">
      <h1 className=" text-3xl font-bold text-white">Welcome to Our Workshop in Team Activity</h1>
      {/* <Randomizer /> */}
      <TeamRegistration />
    </div>
  );
}
