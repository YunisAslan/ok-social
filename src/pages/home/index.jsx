import { buttonVariants } from "@/components/ui/Button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex justify-center items-center h-96">
      <Link
        to="/feed"
        className={buttonVariants({
          variant: "default",
          size: "default",
        })}
      >
        Go to feed
      </Link>
    </div>
  );
}

export default Home;
