import React from "react";

interface CompanyLogoProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export function CompanyLogo({
  className,
  width = 40,
  height = 40,
  color = "currentColor",
}: CompanyLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 1440 900'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
    >
      <g transform='matrix(3.03046,0,0,3.03046,-1124,-699.42)'>
        <g>
          <g transform='matrix(0.322301,0.322301,-0.322301,0.322301,434.96,152.637)'>
            <rect
              x='390.894'
              y='334.277'
              width='219.393'
              height='219.393'
              fill={color}
            />
          </g>
          <g transform='matrix(0.322301,0.322301,-0.322301,0.322301,512.742,74.855)'>
            <rect
              x='390.894'
              y='334.277'
              width='219.393'
              height='219.393'
              fill={color}
            />
          </g>
          <g transform='matrix(0.322301,0.322301,-0.322301,0.322301,590.523,152.637)'>
            <rect
              x='390.894'
              y='334.277'
              width='219.393'
              height='219.393'
              fill={color}
            />
          </g>
          <g transform='matrix(0.322301,0.322301,-0.322301,0.322301,667.744,74.855)'>
            <rect
              x='390.894'
              y='334.277'
              width='219.393'
              height='219.393'
              fill={color}
            />
          </g>
          <g transform='matrix(0.322301,0.322301,-0.322301,0.322301,745.525,-2.92676)'>
            <rect
              x='390.894'
              y='334.277'
              width='219.393'
              height='219.393'
              fill={color}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
