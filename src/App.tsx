import "./App.scss";
import LoginPage from "./pages/LoginPage";
import { Container, Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Main from "./pages/Main";
import RegistrationPage from "./pages/RegistrationPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const App: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "#00b0ff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        pt: 10,
      }}
    >
      <Container sx={{}}>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          limit={1}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Container>
    </Box>
  );
};

export default App;
