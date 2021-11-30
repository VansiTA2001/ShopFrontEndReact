import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route ,Switch} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import 'react-toastify/dist/ReactToastify.css'
import Header from "./Header";
import ServerErroṛ̣̣ from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/baskets/BasketPage";
import LoadingComponent from "./LoaddingComponent";
import CheckoutPage from "../../features/checkout/CheckOutPage";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync, setBasket } from "../../features/baskets/basketSlice";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import PrivateRoute from "./PrivateRoute";
import Orders from "../../features/orders/Order";

function App() {
  const dispatch = useAppDispatch();
  const[loading,setLoading] =useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])
 

  const [darkMode,setDarkMode] = useState(false);
  const paletteType = darkMode? 'dark':'light';
 const theme = createTheme({
   palette:{
     mode:paletteType,
     background:{
       default:paletteType==='light'?'#eaeaea':'#121212'
     }
   }
 })
 function handleThemeChange(){
   setDarkMode(!darkMode)
 }
 if(loading) return<LoadingComponent message='Initial app.....'/>
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
      <Switch>

        <Route exact path='/' component={HomePage}/>
        <Route exact path='/catalog' component={Catalog}/>
        <Route path='/catalog/:id' component={ProductDetails}/>
        <Route path='/contact' component={ContactPage}/>
        <Route path='/about' component={AboutPage}/>
        <Route path='/server-error' component={ServerErroṛ̣̣}/>
        <Route path='/basket' component={BasketPage}/>
        <PrivateRoute path='/checkout' component={CheckoutPage}/>
        <PrivateRoute path='/orders' component={Orders} />
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route  component={NotFound}/>
        </Switch>
      </Container>

    </ThemeProvider>
  );
}

export default App;
