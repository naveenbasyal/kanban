import React from "react";

const BrandLogo = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <g clipPath="url(#clip0_2_8)">
          <rect
            width="10.9091"
            height="10.9091"
            fill="url(#paint0_linear_2_8)"
          />
          <rect
            y="13.0909"
            width="10.9091"
            height="10.9091"
            fill="url(#paint1_linear_2_8)"
          />
          <path
            d="M13.0909 13.0909C19.1158 13.0909 24 17.9751 24 24H13.0909V13.0909Z"
            fill="url(#paint2_linear_2_8)"
          />
          <path
            d="M13.0909 0H24C24 6.02492 19.1158 10.9091 13.0909 10.9091V0Z"
            fill="url(#paint3_linear_2_8)"
          />
          <g filter="url(#filter0_i_2_8)">
            <circle cx="12" cy="12" r="4.36364" fill="white" />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_i_2_8"
            x="7.63636"
            y="7.63636"
            width="8.72727"
            height="8.72727"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="1"
              operator="erode"
              in="SourceAlpha"
              result="effect1_innerShadow_2_8"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.176471 0 0 0 0 0.803922 0 0 0 0 0.356863 0 0 0 0.08 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_2_8"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2_8"
            x1="0"
            y1="0"
            x2="10.9091"
            y2="11.0796"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4F64" />
            <stop offset="0.97573" stopColor="#0047FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2_8"
            x1="0"
            y1="13.0909"
            x2="10.9091"
            y2="24.1704"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4F64" />
            <stop offset="0.97573" stopColor="#0047FF" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2_8"
            x1="13.0909"
            y1="13.0909"
            x2="24"
            y2="24.1704"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4F64" />
            <stop offset="0.97573" stopColor="#0047FF" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2_8"
            x1="13.0909"
            y1="0"
            x2="24"
            y2="11.0796"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4F64" />
            <stop offset="0.97573" stopColor="#0047FF" />
          </linearGradient>
          <clipPath id="clip0_2_8">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default BrandLogo;
