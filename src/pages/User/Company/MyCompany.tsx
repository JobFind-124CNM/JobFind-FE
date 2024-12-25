import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Company } from "@/models/company.interface";
import api from "@/utils/api";
import {
  MapPin,
  Globe,
  Users,
  Loader2,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { Post } from "@/models/post.interface";
import { Button } from "@/components/ui/button";

export default function MyCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);

  const getCompany = async () => {
    try {
      const response = await api.get(`/companies/my-company`);
      setCompany(response.data.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const fetchCompanyPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/company/${company?.id}`, {
        params: { p: page, s: 2 },
      });
      setPosts(response.data.data);
      setTotalPages(response.data.pagination.last_page);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching company posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompany();
    fetchCompanyPosts();
  }, []);

  const sanitizeHtml = (content: string) => {
    return DOMPurify.sanitize(content, {
      ADD_TAGS: [
        "ul",
        "ol",
        "li",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "br",
        "strong",
        "em",
        "a",
      ],
      ADD_ATTR: ["href", "target", "rel"],
    });
  };

  const renderContent = (content: string) => {
    const sanitizedContent = sanitizeHtml(content);
    return (
      <div className="prose prose-slate max-w-none">
        {parse(sanitizedContent)}
      </div>
    );
  };

  const handlePageChange = (page: number) => {
    fetchCompanyPosts(page);
  };

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-20">
      <div className="relative">
        <div className="h-[300px] w-full overflow-hidden rounded-t-xl">
          <img
            src={company.thumbnail || "/placeholder-banner.jpg"}
            alt="Company banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute left-8 -bottom-16 flex items-end gap-6">
          <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
            <img
              src={company.logo || "/placeholder-logo.png"}
              alt={company.name}
              className="w-full h-full rounded-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {company.name}
                  </h1>
                  <Badge
                    variant={
                      company.status === "Active" ||
                      company.status === "Verified"
                        ? "active"
                        : "secondary"
                    }
                  >
                    {company.status}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Globe className="w-4 h-4" />
                    {company.website.replace("https://", "")}
                  </a>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.amount_of_employee} nhân viên
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.address}
                  </span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="text-xl font-semibold">
                Giới thiệu công ty
              </CardHeader>
              <CardContent>
                {renderContent(company.description || "")}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Bài đăng tuyển dụng</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {renderContent(post.description)}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <Badge variant="default">{post.category.name}</Badge>
                          <Link to={`/posts/${post.id}`}>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="text-xl font-semibold">
                Thông tin liên hệ
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ công ty
                  </h3>
                  <p className="text-sm text-gray-600">{company.address}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </h3>
                  <p className="text-sm text-gray-600">{company.phone}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </h3>
                  <p className="text-sm text-gray-600">{company.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
