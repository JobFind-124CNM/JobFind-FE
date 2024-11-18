import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Banner() {
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
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="eg. Web Developer"
                className="flex-1"
              />
              <Select>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Localtion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hn">Hà Nội</SelectItem>
                  <SelectItem value="dn">Đà Nẵng</SelectItem>
                  <SelectItem value="tphcm">TP. HCM</SelectItem>
                  <SelectItem value="cantho">Cần Thơ</SelectItem>
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
