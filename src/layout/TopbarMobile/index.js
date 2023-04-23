import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconMenu from '../../assets/png/topbar/icon-more-menu.svg';
import ModalMenu from './ModalMenu';


function TopbarMobile() {
  const navigate = useNavigate();
  const [isShowMenu, setShowMenu] = useState(false);

  const goHome = () => {
    window.scrollTo(0, 0);
    navigate("/");
  };

  const showMenu = () => {
    setShowMenu(true);
  };
  const hideMenu = () => {
    console.log("vao hide minu");
    setShowMenu(false);
  };

  return (
    <div className="top-layout-mobile">
      <div className="logo" onClick={goHome} />
      <div onClick={showMenu} style={{display:"flex",alignItems:"center"}}>
        <img src={IconMenu} />
      </div>
      {isShowMenu ? (
        <ModalMenu isModalVisible={isShowMenu} setShowMenu={setShowMenu} hideMenu={hideMenu} />
      ) : null}
    </div>
  );
}

export default TopbarMobile;
