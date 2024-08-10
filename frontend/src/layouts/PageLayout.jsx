import BoardHeader from "./headers/BoardHeader";
import BoardDetailHeader from "./headers/BoardDetailHeader";
import SearchHeader from "./headers/SearchHeader";
import PostHeader from "./headers/PostHeader";

import Tabbar from "./Tabbar";
import "../assets/styles/App.css"

const PageLayout = ({ page, pageType }) => {
  let headerComponent;

  switch (pageType) {
    case "board":
      headerComponent = <BoardHeader />;
      break;
    case "boardDetail":
      headerComponent = <BoardDetailHeader />;
      break;
    case "post":
      headerComponent = <PostHeader />;
      break;
    case "search" || "template":
      headerComponent = <SearchHeader />;
      break;
    case "myPage":
      headerComponent = <BoardHeader />;
      break;
    case "myBoard":
      headerComponent = <SearchHeader />;
      break;
    case "myLike":
      headerComponent = <SearchHeader />;
      break;
    case "myInfo":
      headerComponent = <SearchHeader />;
      break;
    case "myTrade":
      headerComponent = <SearchHeader />;
      break;
    default:
      break;
  }

  return (
    <div>
      {headerComponent}
      {page}
      <Tabbar />
    </div>
  );
};

export default PageLayout;