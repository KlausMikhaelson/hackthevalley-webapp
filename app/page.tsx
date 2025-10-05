import { currentUser } from "@clerk/nextjs/server";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
