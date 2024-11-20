import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageIcon } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
  thumbnail: string;
  amountOfEmployees: number;
  taxNumber: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function CompanyRegister() {
  const [company, setCompany] = useState<Partial<Company>>({
    name: "",
    description: "",
    website: "",
    amountOfEmployees: 0,
    taxNumber: "",
    status: "active",
  });

  const [files, setFiles] = useState<{
    logo?: FileWithPreview;
    thumbnail?: FileWithPreview;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "thumbnail"
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
    setCompany((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted company data:", { ...company, ...files });
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/companies" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Đăng ký Công Ty</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên</Label>
                <Input
                  id="name"
                  name="name"
                  value={company.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxNumber">Mã số thuế</Label>
                <Input
                  id="taxNumber"
                  name="taxNumber"
                  value={company.taxNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Nhập địa chỉ công ty"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Ảnh đại diện</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "logo")}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-center border rounded-lg h-[100px] bg-gray-50">
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
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountOfEmployees">Số nhân viên</Label>
                <Input
                  id="amountOfEmployees"
                  name="amountOfEmployees"
                  type="number"
                  value={company.amountOfEmployees}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Link website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={company.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Ảnh bìa</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-center border rounded-lg h-[100px] bg-gray-50">
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Giới thiệu công ty</Label>
            <ReactQuill
              theme="snow"
              value={company.description}
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
          </div>

          <div className="pt-8 space-y-2">
            <Label htmlFor="preview">Preview</Label>
            <div
              id="preview"
              className="p-4 border rounded-md bg-gray-50"
              dangerouslySetInnerHTML={{ __html: company.description || "" }}
            />
          </div>

          <div className="flex justify-end pt-8">
            <Button type="submit" size="lg">
              Lưu thông tin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
