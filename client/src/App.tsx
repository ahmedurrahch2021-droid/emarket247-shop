/** Vermilion Atelier: route map is intentionally small, editorial, and commerce-ready without unapproved catalog claims. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CollectionPage from "./pages/CollectionPage";
import Home from "./pages/Home";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";
import { SeoHead } from "./components/SeoHead";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/shop"} component={CollectionPage} />
      <Route path={"/categories"} component={CollectionPage} />
      <Route path={"/bridal"} component={CollectionPage} />
      <Route path={"/occasions"} component={CollectionPage} />
      <Route path={"/about"} component={InfoPage} />
      <Route path={"/contact"} component={InfoPage} />
      <Route path={"/cart"} component={InfoPage} />
      <Route path={"/faq"} component={InfoPage} />
      <Route path={"/shipping-returns"} component={InfoPage} />
      <Route path={"/privacy"} component={InfoPage} />
      <Route path={"/terms"} component={InfoPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SeoHead />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
