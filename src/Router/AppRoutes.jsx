import { BrowserRouter, Route, Routes } from 'react-router';
import Root from '../Pages/Root';
import Home from '../Pages/Home';

import SignIn from '../Authentication/SignIn';
import PrivateRoute from './PrivateRoute';
import ErrorPage from '../ErrorPage';

import OrderManage from '../Pages/Order_Management/OrderManage';
import Register from '../Authentication/Register';
import UserManage from '../Pages/UserManagement/UserManage';
import SavedOrder from '../Pages/SavedOrder/SavedOrder';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root></Root>}>
                    <Route path="*" element={<ErrorPage />} />
                    <Route index element={<Home></Home>} />
                    <Route path='login' element={<SignIn></SignIn>} />
                    <Route path='register' element={<Register></Register>} />



                    <Route path='orderManage' element={
                        <PrivateRoute>
                            <OrderManage></OrderManage>
                        </PrivateRoute>
                    } />
                    <Route path='userManage' element={
                        <PrivateRoute>
                            <UserManage></UserManage>
                        </PrivateRoute>
                    } />

                    <Route path='savedOrder' element={
                        <PrivateRoute>
                            <SavedOrder></SavedOrder>
                        </PrivateRoute>
                    } />


                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
