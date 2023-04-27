import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./hocs/Layout";
import NotifyLayout from './hocs/NotifyLayout';

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Sidebar from './components/common/Sidebar';
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import Profile from './pages/Profile';
import OutdatedAppointments from './pages/OutdatedAppointments';
import StoreDiagnosis from './pages/StoreDiagnosis';
import AddDoctor from './pages/AddDoctor';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetail from './pages/PatientDetail';
import EditDiagnosis from './pages/EditDiagnosis';
import Notifications from './pages/Notifications';
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <NotifyLayout>
            <Header />
            <Sidebar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/outdated-appointments" element={<OutdatedAppointments />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/store-diagnosis" element={<StoreDiagnosis />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/patient-detail/:id" element={<PatientDetail />} />
              <Route path="/edit-diagnosis/:appointID" element={<EditDiagnosis />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
          </NotifyLayout>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;