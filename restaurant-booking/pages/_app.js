// pages/_app.js
import { Toaster } from 'react-hot-toast';
import '../styles/global.css'; // Import global styles here


function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-black'>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
}

export default MyApp;
