import LogoutButton from "../components/LogoutButton";
import NavigationBarApp from "../components/NavigationBarApp";

export default function homepageUser() {
  return (
    <div>
      <div className="sticky top-0 z-50 bg-white ">
        <NavigationBarApp />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Hello</h1>
        <LogoutButton />
      </div>
    </div>
  );
}