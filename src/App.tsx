import "./App.css";
import Banner from "@/components/Banner/Banner";
import CategoriesGrid from "@/components/Category/CategoryList";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import JobList from "@/components/Job/JobList";

function App() {
  return (
    <div className="App">
      <Header />

      <Banner />

      <JobList />

      <CategoriesGrid />

      <Footer />
    </div>
  );
}

export default App;
