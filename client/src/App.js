import React, { Suspense, lazy, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { currentUser } from "./functions/auth";

const Home = lazy(() => import("./pages/Home"));
const Password = lazy(() => import("./pages/user/Password"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const Header = lazy(() => import("./components/nav/Header"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() => import("./pages/admin/category/CategoryCreate"));
const CategoryUpdate = lazy(() => import("./pages/admin/category/CategoryUpdate"));
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const RoleCreate = lazy(() => import("./pages/admin/role/RoleCreate"));
const RoleUpdate = lazy(() => import("./pages/admin/role/RoleUpdate"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await getIdTokenResult(user);

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch(() => {
            dispatch({
              type: "LOGOUT",
              payload: null,
            });
          });
      } else {
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub/:slug" component={SubHome} />
        <UserRoute exact path="/user/password" component={Password} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute exact path="/admin/sub" component={SubCreate} />
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
        <AdminRoute exact path="/admin/role" component={RoleCreate} />
        <AdminRoute exact path="/admin/role/:slug" component={RoleUpdate} />
      </Switch>
    </Suspense>
  );
};

export default App;
