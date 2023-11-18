import React, { FC } from "react";

type props = {
  title: string;
  description: string;
};

const Heading: FC<props> = ({ title, description }) => {
  return (
    <>
      <div>
        <h2 className="text-3xl font-bold tracking-wide">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </>
  );
};

export default Heading;
