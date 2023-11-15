import { useSelector } from "react-redux";

const Home = () => {
    
  const userData = useSelector((state: any) => state.auth?.userData);
  const accessToken = useSelector((state: any) => state.auth?.accessToken);
  const refreshToken = useSelector((state: any) => state.auth?.refreshToken);
  console.log(userData);
  console.log(accessToken);
  console.log(refreshToken);

  return (
    <div className="main-section">
      <div>Home</div>
    </div>
  );
};
  
  export default Home;