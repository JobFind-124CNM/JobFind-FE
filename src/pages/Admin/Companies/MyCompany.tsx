import AdminLayout from "@/components/Layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Company } from "@/models/company.interface";
import PreviewMyCompany from "@/pages/Admin/Companies/PreviewMyCompany";
import UpdateMyCompany from "@/pages/Admin/Companies/UpdateMyCompanies";
import api from "@/utils/api";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const navigate = useNavigate();

  const getCompany = async () => {
    const response = await api.get("/companies/my-company");

    setCompany(response.data.data);
  };

  useEffect(() => {
    getCompany();
  }, []);

  if (!company) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Company not found</h1>
        </div>
      </AdminLayout>
    );
  }

  const handleUpdateCompany = async (formData: FormData) => {
    const response = await api.post(`/companies/${company.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      showToast("Company updated successfully", "success");

      navigate("/admin/hr/my-company");
    } else {
      showToast("Failed to update company", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">My Company</h1>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit Company</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <PreviewMyCompany company={company} />
          </TabsContent>
          <TabsContent value="edit">
            <UpdateMyCompany
              company={company}
              handleUpdate={handleUpdateCompany}
            />
          </TabsContent>
        </Tabs>
      </div>
      <ToastContainer />
    </AdminLayout>
  );
}
