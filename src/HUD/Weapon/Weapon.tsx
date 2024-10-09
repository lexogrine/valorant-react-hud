import React from "react";
import { weapons } from "./../../assets/weapons/weapons";

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  weapon: string | undefined;
}
const WeaponImage = ({ weapon, ...x }: IProps) => {
  if(!weapon) return null;
  const { className, ...rest } = x;
  const weaponSrc = (weapons as any)[weapon];
  if (!weaponSrc) return null;
  return (
    <img src={weaponSrc} alt={weapon} {...rest} className={`weapon ${className || ""}`} />
  );
};

export default React.memo(WeaponImage);
