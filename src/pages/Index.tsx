import { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import MainInterface from "@/components/MainInterface";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <MainInterface />;
};

export default Index;
