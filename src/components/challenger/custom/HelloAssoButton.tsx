import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

interface HelloAssoButtonProps {
  isLoading: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const HelloAssoButton = ({
  isLoading,
  onClick,
}: HelloAssoButtonProps) => {
  return (
    <Button
      className="border-[#3d33a6] group-hover:border-[#3d33a6] p-0 group [&_svg]:size-12"
      variant="outline"
      disabled={isLoading}
      onClick={onClick}
    >
      <svg
        width="46"
        viewBox="20 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pl-4 w-14"
      >
        <g clip-path="url(#clip0_16_2460)">
          <path
            d="M28.7465 34.0888C24.2637 28.8367 27.2522 15.5602 29.1589 15.5602C25.477 15.4863 19.2669 17.9752 20.1037 26.856C20.428 29.479 21.4172 31.9676 22.9717 34.071C24.5263 36.1745 26.5912 37.8184 28.9584 38.8373C31.3257 39.8562 33.9116 40.2139 36.4558 39.8746C38.9999 39.5352 41.4123 38.5107 43.4499 36.9043C36.409 42.0947 31.6364 37.468 28.7465 34.0888Z"
            fill="url(#paint0_linear_16_2460)"
          />
          <path
            d="M45.1931 25.1679C41.4695 32.8474 30.0474 36.0787 28.7563 34.1011C30.9888 37.4433 36.5265 42.1101 43.5046 36.8734C45.5247 35.2573 47.0962 33.1214 48.0613 30.6806C49.0264 28.2397 49.3509 25.58 49.0022 22.9689C48.6536 20.3577 47.6441 17.8872 46.0752 15.8059C44.5063 13.7245 42.4334 12.1056 40.0649 11.1121C47.9515 14.7223 47.1536 21.1234 45.1931 25.1679Z"
            fill="url(#paint1_linear_16_2460)"
          />
          <path
            d="M29.1602 15.5613C37.2292 14.671 46.3531 23.1852 45.1936 25.169C47.4648 21.2015 47.9848 14.7234 40.1131 11.1132C37.7418 10.118 35.1584 9.78278 32.6218 10.1412C30.0853 10.4996 27.6847 11.5391 25.6607 13.1554C23.6368 14.7716 22.0606 16.9079 21.0902 19.35C20.1199 21.7922 19.7894 24.4543 20.1319 27.0696C19.5611 18.2381 26.1478 15.8939 29.1602 15.5613Z"
            fill="url(#paint2_linear_16_2460)"
          />
        </g>
        <linearGradient
          id="paint0_linear_16_2460"
          x1="23.1041"
          y1="17.5615"
          x2="36.9885"
          y2="40.8976"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3B8964" />
          <stop offset="0.25" stop-color="#5ABF8C" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_16_2460"
          x1="33.6387"
          y1="38.5088"
          x2="48.0033"
          y2="15.916"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#803471" />
          <stop offset="0.21" stop-color="#B34F9E" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_16_2460"
          x1="22.2234"
          y1="16.1265"
          x2="45.6611"
          y2="24.404"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.6" stop-color="#F99C2E" />
          <stop offset="1" stop-color="#C57538" />
        </linearGradient>
        <clipPath id="clip0_16_2460">
          <rect
            width="30"
            height="30"
            fill="white"
            transform="translate(20 10)"
          />
        </clipPath>
        <clipPath id="clip1_16_2460">
          <rect
            width="72"
            height="22"
            fill="white"
            transform="translate(173 14)"
          />
        </clipPath>
      </svg>
      <span className="text-white bg-[#4C40CF] group-hover:bg-[#3d33a6] h-full justify-center flex items-center rounded-r-sm w-[165px]">
        {isLoading ? (
          <ReloadIcon className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {"Payer avec "}
            <span className="font-bold ml-1">helloasso</span>
          </>
        )}
      </span>
    </Button>
  );
};
