import { useSelector } from "react-redux";

const Home = () => {
    
  const userData = useSelector((state: any) => state.auth?.userData);

  return (
    <div className="main-section">
      <div>{userData}</div>
    </div>
  );
};
  
  export default Home;