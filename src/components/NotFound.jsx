import CrashedErrorSvg from "@/assets/Illustrations/crashed-error.svg";
import { buttonVariants } from "./ui/Button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col mt-8 items-center h-screen w-full relative">
      <div className="w-1/3">
        <img src={CrashedErrorSvg} alt="" className="w-full h-full" />
      </div>

      <p className="py-2 text-2xl font-semibold text-red-600">404 Not Found</p>

      <Link
        to="/feed"
        className={buttonVariants({
          variant: "outline",
          size: "default",
        })}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
