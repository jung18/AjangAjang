import BoardHeader from "./headers/BoardHeader";
import BoardDetailHeader from "./headers/BoardDetailHeader";

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
    // 다른 페이지 타입에 따라 다른 헤더 컴포넌트 추가 가능
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