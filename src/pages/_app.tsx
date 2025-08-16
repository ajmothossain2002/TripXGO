import type { AppProps } from "next/app";
import Layout from "../wrapper/layout";
import "@/styles/globals.css";
 import { CssBaseline } from "@mui/material"
 import { Toaster } from "react-hot-toast";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
     <QueryClientProvider client={queryClient}>
      <CssBaseline />
       <Toaster position="top-right" />
    
      <Component {...pageProps} />
   
    </QueryClientProvider>
     </Layout>
  );
}



