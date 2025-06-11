
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PDFProvider } from "@/contexts/PDFContext";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Complete from "./pages/Complete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PDFProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PDFProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
