import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CircleDollarSign, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/models/post.interface";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/utils";
import { formatDate } from "date-fns";

const getBadgeColor = (type: Post["form_of_work"]) => {
  switch (type.name) {
    case "Part-time":
      return "bg-[#00b5e2] hover:bg-[#00b5e2]/80";
    case "Full-time":
      return "bg-yellow-500 hover:bg-yellow-500/80";
    case "Freelance":
      return "bg-[#00b5e2] hover:bg-[#00b5e2]/80";
    case "Internship":
      return "bg-blue-500 hover:bg-blue-500/80";
  }
};

export default function JobItem(data: Post) {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                p-4 sm:p-6 bg-white rounded-lg shadow-sm border 
                transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="space-y-2 w-full sm:w-auto mb-4 sm:mb-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-xl font-semibold">
            <Link to={`/posts/${data.id}`}>{data.title}</Link>
          </h3>
          <Badge
            className={cn(
              "text-white text-xs sm:text-sm",
              getBadgeColor(data.form_of_work)
            )}
          >
            {data.form_of_work.name}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{data.company.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{data.area?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{formatCurrency(data.salary)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(data.created_at, "yyyy-MM-dd")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <Button variant="default" className="w-full sm:w-auto">
          Apply Job
        </Button>
      </div>
    </div>
  );
}
