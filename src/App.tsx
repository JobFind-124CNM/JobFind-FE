import "./App.css";
import Banner from "@/components/Banner/Banner";
import CategoriesGrid from "@/components/Category/CategoryList";
import JobList from "@/components/Job/JobList";

function App() {
  return (
    <div className="App">
      <Banner />

      <JobList />

      <CategoriesGrid />
    </div>
  );
}

export default App;
