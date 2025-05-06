import {Link} from "@/i18n/routing";
import React from "react";

export function AccountLinks({
                               onClose,
                               onSignOut,
                               isMobile = false,
                             }: {
  onClose: () => void;
  onSignOut: () => void;
  isMobile?: boolean;
}) {
  const linkClass = isMobile
    ? "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900"
    : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100";
  return (
    <>
      <Link href="/profile" onClick={onClose} className={linkClass}>
        Profile
      </Link>
      <Link href="/settings" onClick={onClose} className={linkClass}>
        Settings
      </Link>
      <Link href="/feedback" onClick={onClose} className={linkClass}>
        Feedback
      </Link>
      <button
        onClick={onSignOut}
        className={`${linkClass} w-full text-left`}
        type="button"
      >
        Logout
      </button>
    </>
  );
}