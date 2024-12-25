import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area } from "@/models/area.interface";
import { Category } from "@/models/category.interface";
import api from "@/utils/api";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const navigate = useNavigate();

  const getCategories = async () => {
    const response = await api.get("/categories");

    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const getLocations = async () => {
    const response = await api.get("/areas");

    if (response.status === 200) {
      setLocations(response.data.data);
    }
  };

  useEffect(() => {
    getCategories();
    getLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append("q", searchQuery);
    if (selectedCategory) queryParams.append("category_id", selectedCategory);
    if (selectedLocation) queryParams.append("area_id", selectedLocation);

    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <section
      className="min-h-screen"
      style={{
        backgroundImage: 'url("hero_bg_1.jpg.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative max-w-[1320px] mx-auto px-6 pt-24 md:pt-48">
        <div className="max-w-3xl">
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl md:text-8xl font-bold tracking-tight">
              Largest Job <span className="font-normal">Site</span>
            </h1>
            <p className="text-5xl md:text-6xl font-normal tracking-tight">
              On The Net
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form
              className="flex flex-col sm:flex-row gap-4"
              onSubmit={handleSearch}
            >
              <Input
                type="text"
                placeholder="eg. Web Developer"
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedLocation(value)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Localtion" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id.toString()}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="default" className="sm:w-[120px]">
                <Search />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
