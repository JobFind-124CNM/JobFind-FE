import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Company } from "@/models/company.interface";
import api from "@/utils/api";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useDebounce } from "@/hook/useDebounce";

export default function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const getCompanies = async (page: number, query: string) => {
    setLoading(true);
    try {
      const response = await api.get("/companies", {
        params: {
          p: page,
          q: query,
        },
      });

      setCompanies(response.data.data);
      setFilteredCompanies(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

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
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800">
              Khám phá 100.000+ công ty nổi bật
            </h1>
            <p className="text-lg text-gray-600">
              Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành
              cho bạn
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Nhập tên công ty"
                  className="pl-10 pr-4 py-6 w-full rounded-lg border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                className="px-8 py-6"
                variant="default"
                onClick={() => getCompanies(1, searchQuery)}
              >
                <Search /> Tìm kiếm
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/company-illustration.webp"
              alt="Company illustration"
              className="w-30 h-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          DANH SÁCH CÁC CÔNG TY NỔI BẬT
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <Link key={company.id} to={`/company/${company.id}`}>
                <Card className="group h-96 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48">
                    <img
                      src={company.thumbnail}
                      alt={`${company.name} background`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="bg-white rounded-lg w-16 h-16 p-2 mb-2">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {renderContent(company.description)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                variant="outline"
                key={page}
                className={`${
                  currentPage === page
                    ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                    : ""
                }`}
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
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
