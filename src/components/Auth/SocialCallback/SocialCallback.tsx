import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import api from "@/utils/api";

const SocialCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginType } = useParams<{ loginType: string }>(); // Lấy loginType từ URL

  const handleSocialCallback = async () => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      showToast(`${loginType} login failed. Missing token or secret.`, "error");
      setError(`${loginType} login failed. Missing token or secret.`);
      setLoading(false);
      return;
    }

    try {
      const userInfo = await api.post(
        "/auth/social/callback",
        {
          login_type: loginType,
          code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem("access_token", userInfo.data.access_token);
      showToast("Login successful!", "success");
      navigate("/");
    } catch (error) {
      console.error(`Error handling ${loginType} callback:`, error);
      setError(`Failed to log in with ${loginType}.`);
      showToast(`Failed to log in with ${loginType}.`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSocialCallback();
  }, [loginType]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Social Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">Processing your login...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Login successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default SocialCallback;
