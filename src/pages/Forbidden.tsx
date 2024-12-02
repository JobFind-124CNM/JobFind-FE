import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
      <p className="text-lg mb-8">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
};

export default Forbidden;
