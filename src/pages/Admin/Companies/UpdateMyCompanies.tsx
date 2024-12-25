import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageIcon, Loader2, FileText, Save } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Company } from "@/models/company.interface";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import api from "@/utils/api";

interface FileWithPreview extends File {
  preview?: string;
}

interface UpdateMyCompanyProp {
  company: Company;
  handleUpdate: (company: FormData) => Promise<void>;
}

export default function UpdateMyCompany({
  company,
  handleUpdate,
}: UpdateMyCompanyProp) {
  const [updateCompany, setUpdateCompany] = useState<Partial<Company>>(company);

  const [files, setFiles] = useState<{
    logo?: FileWithPreview;
    thumbnail?: FileWithPreview;
    contract?: FileWithPreview;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "thumbnail" | "contract"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setFiles((prev) => ({ ...prev, [type]: fileWithPreview }));
    }
  };

  const handleDescriptionChange = (content: string) => {
    setUpdateCompany((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", updateCompany.id?.toString() || "0");
      formData.append("name", updateCompany.name || "");
      formData.append("description", updateCompany.description || "");
      formData.append("website", updateCompany.website || "");
      formData.append(
        "amountOfEmployees",
        updateCompany.amount_of_employee?.toString() || "0"
      );
      formData.append("tax_number", updateCompany.tax_number || "");
      formData.append("address", updateCompany.address || "");
      formData.append("phone", updateCompany.phone || "");
      formData.append("email", updateCompany.email || "");

      if (files.logo) {
        formData.append("logo", files.logo);
      }
      if (files.thumbnail) {
        formData.append("thumbnail", files.thumbnail);
      }
      if (files.contract) {
        formData.append("contract", files.contract);
      }

      console.log(updateCompany);

      console.log("formData", formData);

      handleUpdate(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Failed to register company", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/companies" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Đăng ký Công Ty</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic-info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic-info">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="additional-info">
                Thông tin bổ sung
              </TabsTrigger>
              <TabsTrigger value="description">Giới thiệu công ty</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={updateCompany.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={updateCompany.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Mã số thuế</Label>
                      <Input
                        id="taxNumber"
                        name="taxNumber"
                        value={updateCompany.tax_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Nhập địa chỉ công ty"
                      value={updateCompany.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Ảnh đại diện</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center justify-center border rounded-lg h-[100px] bg-gray-100">
                        {files.logo?.preview ? (
                          <img
                            src={files.logo.preview}
                            alt="Logo preview"
                            className="max-h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>

                      <div className="h-20 w-20">
                        <img src={updateCompany.logo} alt="" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="additional-info">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin bổ sung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={updateCompany.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amountOfEmployees">Số nhân viên</Label>
                      <Input
                        id="amountOfEmployees"
                        name="amountOfEmployees"
                        type="number"
                        value={updateCompany.amount_of_employee}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Link website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={updateCompany.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Ảnh bìa</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center justify-center border rounded-lg h-[100px] bg-gray-100">
                        {files.thumbnail?.preview ? (
                          <img
                            src={files.thumbnail.preview}
                            alt="Thumbnail preview"
                            className="max-h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract">Hợp đồng</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="contract"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "contract")}
                        className="cursor-pointer"
                      />
                      <div className=" border rounded-lg h-[400px] bg-gray-100">
                        {files.contract?.preview ? (
                          <iframe
                            height={400}
                            width={600}
                            src={files.contract.preview}
                          />
                        ) : (
                          <FileText className="h-full w-full text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>Giới thiệu công ty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ReactQuill
                    theme="snow"
                    value={updateCompany.description}
                    onChange={handleDescriptionChange}
                    className="h-[400px] mb-12"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "code-block"],
                        ["clean"],
                      ],
                    }}
                  />
                  <div className="pt-8 space-y-2">
                    <Label htmlFor="preview">Preview</Label>
                    <div
                      id="preview"
                      className="p-4 border rounded-md bg-gray-50"
                      dangerouslySetInnerHTML={{
                        __html: updateCompany.description || "",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save />
              Lưu thông tin
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
