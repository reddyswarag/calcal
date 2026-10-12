import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'CalCal', description:'Personal macro and body progress tracker', manifest:'/manifest.webmanifest', appleWebApp:{capable:true, title:'CalCal',statusBarStyle:'default'} };
export const viewport: Viewport = { width:'device-width', initialScale:1, viewportFit:'cover', themeColor:'#f9fafb' };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
