import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Company } from "@/models/company.interface";
import { MapPin, Globe, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Badge } from "@/components/ui/badge";

interface PreviewMyCompanyProp {
  company: Company;
}

export default function PreviewMyCompany({ company }: PreviewMyCompanyProp) {
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

  return (
    <div className="mt-4">
      <div className="relative">
        <div className="h-[300px] w-full overflow-hidden">
          <img
            src={company?.thumbnail}
            alt="Company banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute left-8 -bottom-16 flex items-end gap-6">
          <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
            <img
              src={company?.logo}
              alt={company?.name}
              className="w-full h-full rounded-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {company?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      <span className="text-lg">{company?.status}</span>
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-6 text-sm text-gray-500">
                  <a
                    href={company?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Globe className="w-4 h-4" />
                    {company?.website.replace("https://", "")}
                  </a>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company?.amount_of_employee} nhân viên
                  </span>
                </div>
              </div>
              {/* <Button className="bg-primary text-white hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Theo dõi công ty
              </Button> */}
            </div>

            <Card>
              <CardHeader className="text-lg font-semibold">
                Giới thiệu công ty
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div>{renderContent(company?.description || "")}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-lg font-semibold">
                Thông tin liên hệ
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ công ty
                  </h3>
                  <p className="text-sm text-gray-600">{company?.address}</p>
                </div>
                {/* <div className="aspect-[4/3] w-full rounded-lg overflow-hidden">
                  <iframe
                    title="Company location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${company.location.lat},${company.location.lng}`}
                    allowFullScreen
                  />
                </div>
                <Button variant="outline" className="w-full">
                  Xem bản đồ lớn hơn
                </Button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
