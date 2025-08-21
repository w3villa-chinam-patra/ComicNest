import React from "react";

interface AvatarProps {
  name: string;
  width: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, width }) => {
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff`}
      alt="User Avatar"
      width={width}
    />
  );
};

export default Avatar;
