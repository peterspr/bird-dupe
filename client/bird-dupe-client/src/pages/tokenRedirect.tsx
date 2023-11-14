import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAction } from "../redux/actions/auth.actions";

const tokenRedirect = () => {
  // const [loading, setLoading] = useState(false);
  // const [loadingText, setLoadingText] = useState("");

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      try {
        const jsonData = JSON.parse(decodeURIComponent(encodedData));
        const dispatchAsync = async () => {
          await dispatch(authAction(jsonData, navigate));
        }
        dispatchAsync();
      } catch (error) {
        console.error('Error decoding JSON data:', error);
      }
    } else {
      console.log('No data parameter found in the URL.');
    }
      

      // setLoading(false);
      // clearTimeout(timeout);
  }, []);

  // const handleClearMessage = () => {
  //   // dispatch(clearMessage());
  // };

  return (
    <section className="bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6">
          
      </div>
    </section>
  );
};
  
export default tokenRedirect;