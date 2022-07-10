import { Header } from './Header';
import Footer from './Footer';

export const PageLayout: React.FC<any> = ({ children }) => {
  return (
    <div>
      <Header/>
      <div style={{minHeight: '100vh'}}>
        {children}
      </div>
      <Footer/>
    </div>
  );
}