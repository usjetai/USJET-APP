import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { CloudBackground } from "@/components/CloudBackground";
import { GlassNav } from "@/components/GlassNav";
import { AuraWidget } from "@/components/AuraWidget";
import { Footer } from "@/components/Footer";
import { StatusBar } from "@/components/StatusBar";

import FlightDeck from "@/pages/flight-deck";
import BriefingRoom from "@/pages/briefing-room";
import PilotsLog from "@/pages/pilots-log";
import MissionControl from "@/pages/mission-control";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30 selection:text-white pb-7">
      <CloudBackground />
      <GlassNav />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
      <AuraWidget />
      <StatusBar />
    </div>
  );
}

function MissionControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden text-foreground">
      <CloudBackground />
      <GlassNav />
      <main className="relative z-10 h-full" style={{ paddingTop: 68, paddingBottom: 28 }}>
        {children}
      </main>
      <AuraWidget />
      <StatusBar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout><FlightDeck /></Layout>
      </Route>
      <Route path="/briefing-room">
        <Layout><BriefingRoom /></Layout>
      </Route>
      <Route path="/pilots-log">
        <Layout><PilotsLog /></Layout>
      </Route>
      <Route path="/mission-control">
        <MissionControlLayout><MissionControl /></MissionControlLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
