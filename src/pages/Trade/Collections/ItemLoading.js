import { Skeleton } from 'antd';
import React from "react";

function ItemLoading() {
  return (
    <div className="market-item">
      <div className="boder">
        <div>
          <Skeleton.Image className="skeleton-image" />
        </div>
        <div>
          <div className="name-name skeleton-box">
            <label className="name"><Skeleton size="large" active /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemLoading;