import DashboardComponent from "./components/DashboardComponent";
import Game from "./components/Game";
import ChatComponent from "./components/NotificationTestComponent";

export default function Home() {
  return (
    <main className="">
      <h1 className="text-2xl font-bold my-4 ml-4">🚧 AffectiveADHD Testing 🚧</h1>
      <Game />
      <DashboardComponent />
      <ChatComponent />
    </main>
  );
}
