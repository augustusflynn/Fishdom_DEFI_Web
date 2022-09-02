import React from 'react'
import { Space, Button } from 'antd'
import { InputWaiting } from 'src/component/skeleton/Skeleton';
function CrownItem({
  infoItem,
  onClick,
  isLoading
}) {
  return (
    <Space size={16} direction="vertical" className="market-item">
      {infoItem.image ? (
        <div>
          <img src={infoItem.image} alt="crown" className="market-img" />
        </div>
      ) : (
        <InputWaiting className="waiting-img" />
      )}
      <Space direction="vertical" size={8}>
        <div className="name-name c2i-no-margin">
          <label className="module-title">{infoItem.name}</label>
        </div>
        <Space direction="horizontal" className="text-center">
          <div className="apr">
            <p style={{ whiteSpace: "nowrap" }}> {infoItem.apr}% APR</p>
          </div>
          <div className="reduce">
            <p style={{ whiteSpace: "nowrap" }}>
              {infoItem.reduce}% Reduce
            </p>
          </div>
        </Space>
      </Space>
      <Button
        className="button c2i-no-margin"
        disabled={isLoading}
        onClick={() => {
          onClick(infoItem.index);
        }}
      >Claim Now</Button>
    </Space>
  )
}

export default CrownItem