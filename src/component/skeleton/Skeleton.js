import { Skeleton } from "antd";
// hsla(0,0%,74.5%,.2)
// export const ImageWaiting = ({ className, width, height }) => {
//   return (
//     <Skeleton.Image
//       active={true}
//       className={className}
//       style={{
//         width: width ? `${width}px` : "100%",
//         height: height ? `${height}px` : "100%",
//       }}
//     />
//   );
// };

export const InputWaiting = ({ className, width, height }) => {
  return (
    <Skeleton.Input
      active
      className={className}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    />
  );
};
