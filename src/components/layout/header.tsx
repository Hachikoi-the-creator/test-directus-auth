import BtnMenu from "./btn-menu";
import BtnTheme from "./btn-theme";
import UserArea from "./userarea";

type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-10 flex w-full border-b bg-background">
      <div className="shadow-2 flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="lg:hidden">
            <BtnMenu />
          </div>
        </div>
        <div className="2xsm:gap-7 flex items-center gap-3">
          <BtnTheme />
          {user && <UserArea user={user} />}
        </div>
      </div>
    </header>
  );
}
