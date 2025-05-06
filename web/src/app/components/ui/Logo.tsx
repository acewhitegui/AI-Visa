import Image from "next/image";
import {Link} from "@/i18n/routing";

export default function Logo({
                               src,
                               onClick,
                               children,
                             }: {
  src: string | null | undefined;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Link
      title="Any Concverters Homepage"
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2"
      onClick={onClick}
    >
      {src && <Image src={src} alt="logo" width={45} height={45}/>}
      <div className="ml-2">{children}</div>
    </Link>
  );
}
