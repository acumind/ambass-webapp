import Link from "next/link";
import styles from "../../styles/Home.module.css";
import LoadingSpinner from "./LoaderSpinner";

export default function Header({ isLoading }) {
  return (
    <div>
      <nav className="mt-5 mb-5 border-b-2 flex flex-row">
        <h1 className="py-1 px-4 font-bold text-5xl"> Ambass!</h1>

        <div className="ml-auto py-4 px-1 ">
          <Link href="/">Home</Link>
        </div>
        <div className="ml-auto py-4 px-1">
          <Link href="/components/list_campaign"> All Campaigns</Link>
        </div>
        <div className="ml-auto py-4 px-1">
          <Link href="/components/my_campaigns">My Campaigns</Link>
        </div>
        <div className="ml-auto py-4 px-1">
          <Link href="/components/joined_campaigns">Joined Campaigns</Link>
        </div>
        <div className="ml-auto py-4 px-1">
          <Link href="/components/new_campaign">New Campaign</Link>
        </div>
      </nav>
      {isLoading ? <LoadingSpinner /> : ""}
    </div>
  );
}
