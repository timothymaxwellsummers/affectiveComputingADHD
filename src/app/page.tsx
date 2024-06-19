import DashboardComponent from "./components/DashboardComponent";
import Game from "./components/Game";
import Link from 'next/link'
 
export default function Home() {
  return (
    <main className="">
      <div className='bg-gradient-to-r from-[rgba(173,216,230,0.5)] to-[rgba(0,0,255,0.5)]  p-4 '>
      <h1 className="text-2xl font-bold my-4 ml-4 text-[rgb(0,14,128)] ">Affective ADHD</h1>
     
      <Game />
      <DashboardComponent />
      <li>
        <Link href="/dashboard"> Dashboard</Link>
      </li>
      </div>
    </main>
  );
}
