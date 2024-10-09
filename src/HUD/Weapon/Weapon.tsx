import React from "react";
import * as Weapons from "./../../assets/weapons/weapons";

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  weapon: string;
}
const WeaponImage = ({ weapon, ...x }: IProps) => {
  const { className, ...rest } = x;
  const weaponSrc = (Weapons as any)[weapon];
  if (!weaponSrc) return null;
  return (
    <img src={weaponSrc} alt={weapon} {...rest} className={`weapon ${className || ""}`} />
  );
};

export default React.memo(WeaponImage);
