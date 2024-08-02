import BoardHeader from "./headers/BoardHeader";
import Tabbar from "./Tabbar";
import "../assets/styles/App.css"

const PageLayout = ({ page, pageType }) => {
  return (
    <div>
      {pageType === "board" && <BoardHeader />}
      {page}
      <Tabbar />
    </div>
  );
};

export default PageLayout;