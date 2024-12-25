import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Upload, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/models/user.interface";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user.user);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (prev) {
        return { ...prev, [name]: value };
      }
      return prev;
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "cv" | "avatar"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (fileType === "cv") {
        const file = e.target.files[0];
        setProfile((prev) => {
          if (prev) {
            return { ...prev, cv: file };
          }
          return prev;
        });
        setCvPreviewUrl(URL.createObjectURL(file));
      } else {
        setProfile((prev) => {
          if (prev) {
            return { ...prev, avatar: URL.createObjectURL(e.target.files![0]) };
          }
          return prev;
        });
      }
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
    // Here you would typically send the data to your backend
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change request:", passwords);
    // Here you would typically send the password change request to your backend
  };

  const handleAvatarSave = () => {
    if (newAvatar) {
      setProfile((prev) => {
        if (prev) {
          return { ...prev, avatar: newAvatar };
        }
        return prev;
      });
    }
    setIsAvatarDialogOpen(false);
  };

  const handleAvatarDelete = () => {
    setNewAvatar(null);
    setProfile((prev) => {
      if (prev) {
        return { ...prev, avatar: "/placeholder.svg" };
      }
      return prev;
    });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Personal Information
            </h1>
            <p className="text-red-500 text-sm">(*) Các thông tin bắt buộc</p>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile?.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={profile?.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="gender">
                      Giới tính <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="gender"
                      value={profile?.gender}
                      onValueChange={(value) =>
                        setProfile((prev) => {
                          if (prev) {
                            return { ...prev, gender: value };
                          }
                          return prev;
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 space-y-2">
                    <Label htmlFor="experience">
                      Kinh nghiệm (năm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="text"
                      min="0"
                      step="1"
                      placeholder="Nhập số năm kinh nghiệm"
                      value={profile?.experience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV</Label>
                  <Input
                    id="cv"
                    name="cv"
                    type="file"
                    onChange={(e) => handleFileChange(e, "cv")}
                    accept=".pdf,.doc,.docx"
                  />
                  {profile?.cv && (
                    <p className="text-sm text-gray-500">
                      File đã chọn: {profile?.cv.name}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="default">
                  Lưu thay đổi
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Đổi mật khẩu
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Profile Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile?.avatar} alt={profile?.username} />
                  <AvatarFallback>
                    {profile?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Dialog
                  open={isAvatarDialogOpen}
                  onOpenChange={setIsAvatarDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>CHỈNH SỬA ẢNH ĐẠI DIỆN</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="mb-2 font-semibold">Ảnh gốc</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "avatar")}
                            accept="image/*"
                          />
                          <Label
                            htmlFor="avatar-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <span className="mt-2 block text-sm text-gray-600">
                              Click chọn ảnh để tải lên
                            </span>
                          </Label>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-2 font-semibold">
                          Ảnh đại diện hiện tại
                        </h3>
                        <Avatar className="w-32 h-32 mx-auto">
                          <AvatarImage
                            src={newAvatar || profile?.avatar}
                            alt={profile?.username}
                          />
                          <AvatarFallback>
                            {profile?.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAvatarDialogOpen(false)}
                      >
                        Đóng lại (Không lưu)
                      </Button>
                      <div>
                        <Button
                          variant="destructive"
                          onClick={handleAvatarDelete}
                          className="mr-2"
                        >
                          Xóa ảnh
                        </Button>
                        <Button
                          className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white"
                          onClick={handleAvatarSave}
                        >
                          Xong
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-200">
                    VERIFIED
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold">Chào bạn trở lại,</h2>
                <p className="font-medium">{profile?.username}</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tài khoản đã xác thực</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-2">
              {profile?.cv && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Selected file: {profile?.cv.name}
                  </p>
                  {cvPreviewUrl && (
                    <div className="border rounded-lg p-4">
                      {profile.cv.type === "application/pdf" ? (
                        <iframe
                          src={cvPreviewUrl}
                          className="w-full h-[400px]"
                          title="CV Preview"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[400px] bg-gray-100">
                          <a
                            href={cvPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-500 hover:underline"
                          >
                            <FileText className="mr-2" />
                            View CV
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
